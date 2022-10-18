import { Logger } from '@paperdave/logger';
import { asyncMap, deferred } from '@paperdave/utils';
import type { GatewayOptions } from '@purplet/gateway';
import { Gateway, GatewayExitError } from '@purplet/gateway';
import { Rest } from '@purplet/rest';
import { deepEqual } from 'fast-equals';
import type {
  APIGuild,
  GatewayDispatchPayload,
  GatewayIntentBits,
  GatewayPresenceUpdateData,
  GatewayReadyDispatchData,
  RESTPutAPIApplicationCommandsJSONBody,
} from 'purplet/types';
import { GatewayDispatchEvents } from 'purplet/types';
import { setGlobalEnv } from './env';
import { FeatureLoader } from './FeatureLoader';
import type { Feature } from './hook';
import {
  $applicationCommands,
  $dispatch,
  $initialize,
  $intents,
  $interaction,
  $presence,
} from './hook-core';
import { mergeCommands, mergeIntents, mergePresence } from './hook-core-merge';
import { runHook } from './hook-run';
import { errorFromGatewayClientExitError, errorTooManyGuilds } from '../cli/errors';
import { $gatewayEvent } from '../hooks';
import { markFeatureInternal } from '../internal';
import type { InteractionResponse } from '../structures';
import { ApplicationFlagsBitfield, createInteraction, User } from '../structures';
import type { Cleanup } from '../utils/types';

interface GatewayBotOptions {
  /** Bot Token. */
  token: string;
  /** Initial list of features that this bot has. */
  features?: Feature[];
  /**
   * If set to true, assumes a development-mode style where commands are deployed per-guild. Do not
   * set while in production.
   */
  deployGuildCommands?: boolean;
  /**
   * If set to true alongside `deployGuildCommands`, will also clear all commands. Do not set while
   * in production.
   */
  deployGuildCommandsCleanup?: boolean;
  /** Rules for command deployment if `deployGuildCommands` is enabled. */
  guildRules?: AllowedGuildRules;
  /** Bot sharding information. */
  shard?: [shard_id: number, shard_count: number];
  /**
   * If set to false, this will not mutate global variables, though it may not be possible for
   * features to access these variables. Defaults to true.
   */
  mutateGlobalEnv?: boolean;
}

export interface PatchFeatureInput {
  add?: Feature[];
  remove?: Feature[];
}

export interface AllowedGuildRules {
  include?: string[];
  exclude?: string[];
}

export type CreateGatewayClientResult = [Gateway, GatewayReadyDispatchData];

export async function createGatewayClient(identify: GatewayOptions) {
  const [promise, resolve, reject] = deferred<CreateGatewayClientResult>();

  const client = new Gateway(identify);

  function errorHandler(e: Error) {
    if (e instanceof GatewayExitError) {
      reject(errorFromGatewayClientExitError(e, client));
    } else {
      reject(e);
    }
  }

  function readyHandler(ready: GatewayReadyDispatchData) {
    resolve([client, ready]);
    client.off('error', errorHandler);
    client.off(GatewayDispatchEvents.Ready, readyHandler);
  }

  client.on('error', errorHandler);
  client.on(GatewayDispatchEvents.Ready, readyHandler);

  return promise;
}

/**
 * GatewayBot is a class that contains a feature loader and a gateway client, and properly
 * implements the 6 core hooks.
 */
// TODO: Rename this class to avoid confusion with `Gateway`
// TODO: split off command deploying logic to a `GuildCommandManager` class
export class GatewayBot {
  features = new FeatureLoader();
  gateway: Gateway | null = null;
  rest: Rest;

  #application?: { id: string; flags: ApplicationFlagsBitfield };
  #user?: User;
  #running = false;
  #cleanupInitializeHook: Cleanup;
  #cachedIntents?: GatewayIntentBits;
  #cachedPresence?: GatewayPresenceUpdateData;
  #cachedCommandData?: RESTPutAPIApplicationCommandsJSONBody;

  get application() {
    if (!this.#application) {
      throw new Error('GatewayBot.application is not yet ready');
    }
    return this.#application;
  }

  get user() {
    if (!this.#user) {
      throw new Error('GatewayBot.user is not yet ready');
    }
    return this.#user;
  }

  get id() {
    return this.user.id;
  }

  constructor(readonly options: GatewayBotOptions) {
    if (this.options.features) {
      this.features.add(this.options.features);
    }
    if (this.options.deployGuildCommands) {
      this.features.add([
        markFeatureInternal(
          'dev.deployGuildCommands',
          $gatewayEvent('GUILD_CREATE', guild => {
            this.updateApplicationCommandsGuild(guild);
          })
        ),
      ]);
    }
    if (this.options.mutateGlobalEnv !== false) {
      this.options.mutateGlobalEnv = true;
    }
    this.rest = new Rest({ token: this.options.token });
    if (this.options.mutateGlobalEnv) {
      setGlobalEnv({
        rest: this.rest,
      });
    }
  }

  async start() {
    if (this.#running) {
      throw new Error('GatewayBot is already running');
    }
    this.#running = true;

    Logger.debug(`starting gateway bot, guildCommands=${this.options.deployGuildCommands}`);
    this.#cleanupInitializeHook = await runHook(this.features, $initialize, undefined);
    await this.startClient();
  }

  private async startClient() {
    // Get gateway configuration
    const [intents, presence] = await Promise.all([
      this.#cachedIntents ?? runHook(this.features, $intents, mergeIntents),
      this.#cachedPresence ?? runHook(this.features, $presence, mergePresence),
    ]);

    this.#cachedIntents = intents;
    this.#cachedPresence = presence;

    // Create gateway client
    const [gateway, readyData] = await createGatewayClient({
      token: this.options.token,
      shard: this.options.shard,
      intents,
      presence,
    });
    this.gateway = gateway;
    this.#user = new User(readyData.user);

    // TODO: implement Application class
    this.#application = {
      id: readyData.application.id,
      flags: new ApplicationFlagsBitfield(readyData.application.flags),
    };

    if (this.options.mutateGlobalEnv) {
      setGlobalEnv({
        application: this.#application,
        botUser: this.#user,
        gateway,
      });
    }

    // Dispatch Hooks
    this.gateway.on('*', (payload: GatewayDispatchPayload) => {
      runHook(this.features, $dispatch, payload);
    });

    // Interaction hooks
    this.gateway.on(GatewayDispatchEvents.InteractionCreate, i => {
      const responseHandler = async (response: InteractionResponse) => {
        await this.rest.interactionResponse.createInteractionResponse({
          interactionId: i.id,
          interactionToken: i.token,
          body: {
            type: response.type,
            // @ts-expect-error casting from unknown to interaction response data
            data: response.data,
          },
          files: response.files,
        });
      };

      const interaction = createInteraction(i, responseHandler);
      runHook(this.features, $interaction, interaction);
    });

    if (this.options.deployGuildCommands) {
      this.#cachedCommandData = await runHook(this.features, $applicationCommands, mergeCommands);
      await this.updateCommands(this.#cachedCommandData);
    }
  }

  private isGuildAllowed(id: string) {
    const { include = [], exclude = [] } = this.options.guildRules ?? {};
    if (include.length > 0 && !include.includes(id)) {
      return false;
    }
    if (exclude.length > 0 && exclude.includes(id)) {
      return false;
    }
    return true;
  }

  private async updateCommands(commands: RESTPutAPIApplicationCommandsJSONBody) {
    if (commands.length === 0) {
      Logger.debug('there are no application commands');
      return;
    }

    this.#cachedCommandData = commands;

    const guildList = await this.rest.user
      .getCurrentUserGuilds()
      .then(guilds => guilds.filter(x => this.isGuildAllowed(x.id)));

    if (guildList.length > 75) {
      throw errorTooManyGuilds();
    }
    if (guildList.length >= 5) {
      Logger.warn(
        `You have ${guildList.length} guilds on your development bot. Many guilds can slow down the bot significantly, as commands are registered per-guild during development.`
      );
    }

    await asyncMap(guildList, guild => {
      this.updateApplicationCommandsGuild(guild);
    });

    Logger.debug('development mode app command push done');
  }

  private async updateApplicationCommandsGuild(guild: Pick<APIGuild, 'name' | 'id'>) {
    try {
      await this.rest.applicationCommand.bulkOverwriteGuildApplicationCommands({
        guildId: guild.id,
        applicationId: this.id,
        body: this.#cachedCommandData!,
      });
      Logger.info(`updated commands on ${guild.name}`);
    } catch (error) {
      Logger.warn(`could not update commands on ${guild.name} (${guild.id})`);
    }
  }

  async close() {
    await Promise.all([
      //
      this.#cleanupInitializeHook?.(),
      this.gateway?.close(),
    ]);
  }

  async patchFeatures({ add = [], remove = [] }: PatchFeatureInput) {
    this.features.remove(remove);
    const coreFeaturesAdded = this.features.add(add);

    Logger.debug(`patching features, ${add.length} add, ${remove.length} remove.`);

    if (!this.#running) {
      return;
    }

    // TODO: clear lifecycle, but maybe that should be done in .remove()?
    await runHook(coreFeaturesAdded, $initialize, undefined);

    const newIntents = await runHook(this.features, $intents, mergeIntents);
    const newPresence = await runHook(this.features, $presence, mergePresence);
    const newCommandData = await runHook(this.features, $applicationCommands, mergeCommands);

    if (newIntents !== this.#cachedIntents) {
      this.#cachedIntents = newIntents;
      this.gateway?.close();
      await this.startClient();
    } else if (!deepEqual(newPresence, this.#cachedPresence)) {
      this.#cachedPresence = newPresence;
      this.gateway?.updatePresence(newPresence);
    }

    if (this.options.deployGuildCommands) {
      if (!deepEqual(newCommandData, this.#cachedCommandData)) {
        this.#cachedCommandData = newCommandData;
        this.updateCommands(newCommandData);
      }
    }
  }
}
