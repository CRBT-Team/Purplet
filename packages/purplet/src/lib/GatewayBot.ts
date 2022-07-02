import {
  APIGuild,
  GatewayDispatchEvents,
  GatewayDispatchPayload,
  GatewayGuildCreateDispatchData,
  GatewayIntentBits,
  GatewayPresenceUpdateData,
  RESTAPIPartialCurrentUserGuild,
  RESTPutAPIApplicationCommandsJSONBody,
  Routes,
} from 'discord-api-types/v10';
import { deepEqual } from 'fast-equals';
import { FeatureLoader } from './FeatureLoader';
import { GatewayClient } from './GatewayClient';
import { rest } from './global';
import type { Feature } from './hook';
import {
  $applicationCommands,
  $dispatch,
  $initialize,
  $intents,
  $interaction,
  $presence,
} from './hook-core';
import { runHook } from './hook-run';
import { log } from './logger';
import { createInteraction, IntentBitfield, InteractionResponse } from '../structures';
import { asyncMap } from '../utils/promise';
import type { Cleanup } from '../utils/types';

interface GatewayBotOptions {
  /** Bot Token. */
  token: string;
  /** Optional, skips a fetch request if provided. */
  id?: string;
  /** Initial list of features that this bot has. */
  features?: Feature[];
  /**
   * If set to true, assumes a development-mode style where commands are deployed per-guild. Do not
   * set while in production.
   */
  deployGuildCommands?: boolean;
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

/**
 * GatewayBot is a class that contains a feature loader and a gateway client, and properly
 * implements the 6 core hooks.
 */
// TODO: split off command deploying logic to a `GuildCommandManager` class
export class GatewayBot2 {
  features = new FeatureLoader();
  client: GatewayClient | null = null;

  #id!: string;
  #running = false;
  #cleanupInitializeHook: Cleanup;
  #cachedIntents?: GatewayIntentBits;
  #cachedPresence?: GatewayPresenceUpdateData;
  #cachedCommandData?: RESTPutAPIApplicationCommandsJSONBody;

  constructor(readonly options: GatewayBotOptions) {
    if (options.id) {
      this.#id = options.id;
    }
    if (this.options.features) {
      this.features.add(this.options.features);
    }
  }

  async start() {
    if (this.#running) throw new Error('GatewayBot is already running');
    if (!this.#id) {
      throw new Error('optional id is not supported');
    }
    log('debug', `starting gateway bot, guildCommands=${this.options.deployGuildCommands}`);
    this.#cleanupInitializeHook = await runHook(this.features, $initialize, undefined);
    await this.startClient();
  }

  private async startClient() {
    // Get gateway configuration
    const [intents, presence] = await Promise.all([
      this.#cachedIntents ?? runHook(this.features, $intents, mergeIntents),
      this.#cachedPresence ??
        runHook(this.features, $presence, (a, b) => ({ ...a, ...b }), undefined!),
    ]);

    this.#cachedIntents = IntentBitfield.resolve(intents).bitfield;
    this.#cachedPresence = presence;

    // Create gateway client
    this.client = new GatewayClient({
      token: this.options.token,
      shard: this.options.shard,
      intents,
      presence,
    });

    // Dispatch Hooks
    this.client.on('*', (payload: GatewayDispatchPayload) => {
      runHook(this.features, $dispatch, payload);
    });

    // Interaction hooks
    this.client.on(GatewayDispatchEvents.InteractionCreate, async i => {
      const responseHandler = async (response: InteractionResponse) => {
        await rest.post(Routes.interactionCallback(i.id, i.token), {
          body: {
            type: response.type,
            data: response.data,
          },
          files: response.files,
        });
      };

      const interaction = createInteraction(i, responseHandler);

      runHook(this.features, $interaction, interaction);
    });

    if (this.options.deployGuildCommands) {
      this.#cachedCommandData = await runHook(
        this.features,
        $applicationCommands,
        (a, b) => [...a, ...b],
        []
      );
      this.client.on(
        GatewayDispatchEvents.GuildCreate,
        async (guild: GatewayGuildCreateDispatchData) => {
          await this.updateApplicationCommandsGuild(guild);
        }
      );
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

    // Check for sameness, and if so, don't update.
    if (this.#cachedCommandData && deepEqual(commands, this.#cachedCommandData)) {
      console.debug('application command data identical, skipping update');
      return;
    }

    this.#cachedCommandData = commands;

    const guildList = (
      (await rest.get(Routes.userGuilds())) as RESTAPIPartialCurrentUserGuild[]
    ).filter(x => this.isGuildAllowed(x.id));

    if (guildList.length > 75) {
      throw new Error("You can't have more than 75 guilds on your development bot.");
    }
    if (guildList.length >= 5) {
      log(
        'warn',
        `You have more ${guildList.length} guilds on your development bot. This can slow down the bot significantly, as commands are registered per-guild during development.`
      );
    }

    await asyncMap(guildList, async guild => {
      this.updateApplicationCommandsGuild(guild);
    });

    console.debug('development mode app command push done');
  }

  private async updateApplicationCommandsGuild(guild: Pick<APIGuild, 'name' | 'id'>) {
    if (!this.#cachedCommandData) {
      throw new Error('No command data cached. Call `.start` first.');
    }

    log('info', `updating commands on ${guild.name}`);
    await rest.put(Routes.applicationGuildCommands(this.#id, guild.id), {
      body: this.#cachedCommandData,
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

    if (!this.#running) return;

    // TODO: clear lifecycle, but maybe that should be done in .remove()?
    await runHook(coreFeaturesAdded, $initialize, undefined);

    const newIntents = await runHook(this.features, $intents, (a, b) => a | b, 0);
    const newPresence = await runHook(
      this.features,
      $presence,
      (a, b) => ({ ...a, ...b }),
      undefined!
    );
    const newCommandData = await runHook(
      this.features,
      $applicationCommands,
      (a, b) => [...a, ...b],
      []
    );

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
