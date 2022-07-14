import { asyncMap, deferred } from '@davecode/utils';
import { Gateway, GatewayExitError } from '@purplet/gateway';
import type { GatewayOptions } from '@purplet/gateway/src/Gateway';
import { Rest } from '@purplet/rest';
import { deepEqual } from 'fast-equals';
import {
  APIGuild,
  GatewayDispatchEvents,
  GatewayDispatchPayload,
  GatewayIntentBits,
  GatewayPresenceUpdateData,
  GatewayReadyDispatchData,
  RESTPutAPIApplicationCommandsJSONBody,
} from 'purplet/types';
import { FeatureLoader } from './FeatureLoader';
import { rest, setRESTClient } from './global';
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
import { log } from './logger';
import { errorFromGatewayClientExitError, errorTooManyGuilds } from '../cli/errors';
import { $gatewayEvent } from '../hooks';
import { markFeature } from '../internal';
import {
  ApplicationFlagsBitfield,
  createInteraction,
  InteractionResponse,
  User,
} from '../structures';
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
}

export interface PatchFeatureInput {
  add: Feature[];
  remove: Feature[];
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
  client: Gateway | null = null;

  #application?: { id: string; flags: ApplicationFlagsBitfield };
  #user?: User;
  #running = false;
  #cleanupInitializeHook: Cleanup;
  #cachedIntents?: GatewayIntentBits;
  #cachedPresence?: GatewayPresenceUpdateData;
  #cachedCommandData?: RESTPutAPIApplicationCommandsJSONBody;

  get application() {
    if (!this.#application) throw new Error('GatewayBot.application is not yet ready');
    return this.#application;
  }

  get user() {
    if (!this.#user) throw new Error('GatewayBot.user is not yet ready');
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
        markFeature(
          'dev.deployGuildCommands',
          $gatewayEvent('GUILD_CREATE', guild => {
            this.updateApplicationCommandsGuild(guild);
          })
        ),
      ]);
    }
  }

  async start() {
    if (this.#running) throw new Error('GatewayBot is already running');
    this.#running = true;
    // TODO: see how the global variable is set here. this should probably be somewhere else.
    setRESTClient(new Rest({ token: this.options.token }));
    log('debug', `starting gateway bot, guildCommands=${this.options.deployGuildCommands}`);
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
    const [client, readyData] = await createGatewayClient({
      token: this.options.token,
      shard: this.options.shard,
      intents,
      presence,
    });
    this.client = client;
    this.#user = new User(readyData.user);

    // TODO: implement Application class
    this.#application = {
      id: readyData.application.id,
      flags: new ApplicationFlagsBitfield(readyData.application.flags),
    };

    // Dispatch Hooks
    this.client.on('*', (payload: GatewayDispatchPayload) =>
      runHook(this.features, $dispatch, payload)
    );

    // Interaction hooks
    this.client.on(GatewayDispatchEvents.InteractionCreate, async i => {
      const responseHandler = async (response: InteractionResponse) => {
        await rest.interactionResponse.createInteractionResponse({
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
      console.debug('there are no application commands');
      return;
    }

    this.#cachedCommandData = commands;

    const guildList = await rest.user
      .getCurrentUserGuilds()
      .then(guilds => guilds.filter(x => this.isGuildAllowed(x.id)));

    if (guildList.length > 75) {
      throw errorTooManyGuilds();
    }
    if (guildList.length >= 5) {
      log(
        'warn',
        `You have ${guildList.length} guilds on your development bot. Many guilds can slow down the bot significantly, as commands are registered per-guild during development.`
      );
    }

    await asyncMap(guildList, async guild => {
      this.updateApplicationCommandsGuild(guild);
    });

    console.debug('development mode app command push done');
  }

  private async updateApplicationCommandsGuild(guild: Pick<APIGuild, 'name' | 'id'>) {
    log('info', `updating commands on ${guild.name}`);
    await rest.applicationCommand.bulkOverwriteGuildApplicationCommands({
      guildId: guild.id,
      applicationId: this.id,
      body: this.#cachedCommandData!,
    });
  }

  async close() {
    await Promise.all([
      //
      this.#cleanupInitializeHook?.(),
      this.client?.close(),
    ]);
  }

  async patchFeatures({ add, remove }: PatchFeatureInput) {
    const coreFeaturesRemoved = await this.features.remove(remove);
    const coreFeaturesAdded = await this.features.add(add);

    log('debug', `patching features, ${add.length} add, ${remove.length} remove.`);

    if (!this.#running) return;

    // TODO: clear lifecycle, but maybe that should be done in .remove()?
    await runHook(coreFeaturesAdded, $initialize, undefined);

    const newIntents = await runHook(this.features, $intents, mergeIntents);
    const newPresence = await runHook(this.features, $presence, mergePresence);
    const newCommandData = await runHook(this.features, $applicationCommands, mergeCommands);

    if (newIntents !== this.#cachedIntents) {
      this.#cachedIntents = newIntents;
      await this.client?.close();
      await this.startClient();
    } else if (!deepEqual(newPresence, this.#cachedPresence)) {
      this.#cachedPresence = newPresence;
      this.client?.updatePresence(newPresence);
    }

    if (this.options.deployGuildCommands) {
      if (!deepEqual(newCommandData, this.#cachedCommandData)) {
        this.#cachedCommandData = newCommandData;
        this.updateCommands(newCommandData);
      }
    }
  }
}
