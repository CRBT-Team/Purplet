// this file is a bit more of a mess than i'd like it to be, but whatever
// TODO: split functions into separate things, such as feature loading, gateway connecting, dev mode specific stuff.
import dedent from 'dedent';
import inquirer from 'inquirer';
import type { Immutable } from '@davecode/types';
import {
  APIApplicationCommandBasicOption,
  APIGuild,
  APIInteraction,
  APIInteractionResponse,
  APIUser,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  GatewayDispatchEvents,
  RESTAPIPartialCurrentUserGuild,
  RESTGetAPIApplicationCommandsResult,
  RESTGetAPICurrentUserResult,
  RESTGetAPIOAuth2CurrentApplicationResult,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from 'discord-api-types/v10';
import { Client } from 'discord.js';
import { deepEqual } from 'fast-equals';
import { getEnvVar } from './env';
import type {
  ApplicationCommandData,
  EventHook,
  Feature,
  GatewayEventHook,
  LifecycleHookNames,
} from './feature';
import { rest, setDJSClient } from './global';
import { log, pauseSpinner } from './logger';
import { createInteraction } from '../structures';
import { featureRequiresDJS } from '../utils/feature';
import { JSONValue, toJSONValue } from '../utils/plain';
import { asyncMap } from '../utils/promise';
import type { Cleanup } from '../utils/types';

// These `.call()`s are needed due to the way features are created
/* eslint-disable no-useless-call */

export interface GatewayBotOptions {
  /**
   * Mode. "production" or "development" depending on what state the bot code is in. If in
   * development, commands are only deployed to a specified set of test servers.
   */
  mode: 'production' | 'development';
  /** If set to false, the bot will not attempt to connect to the gateway. */
  gateway?: boolean;

  checkIfProductionBot?: boolean;
}

interface CleanupHandlers {
  initialize?: Cleanup;
}

interface AllowedGuildRules {
  include?: string[];
  exclude?: string[];
}

/**
 * A GatewayBot represents a bot that is running on a gateway with Discord.js. Features can be
 * loaded and unloaded with `.loadFeatures` and `.unloadFeatures`, respectively. Features may be
 * added after initialization, and will properly hot-swap them, including reconnecting the bot with
 * different intents/config if required.
 *
 * Assumes the bot token is in the environment variable `DISCORD_BOT_TOKEN`.
 */
export class GatewayBot {
  #running = false;
  #token: string = '';
  #features: Feature[] = [];
  #cleanupHandlers = new WeakMap<Feature, CleanupHandlers>();
  #djsClient?: Client;
  #currentIntents: number = 0;
  #id: string = '';
  #cachedCommandData?: ApplicationCommandData[];
  #options: Immutable<GatewayBotOptions> = null as any;
  #owners: APIUser[] = [];
  #guildRules: AllowedGuildRules = {};

  get id() {
    return this.#id;
  }

  get running() {
    return this.#running;
  }

  get features() {
    return this.#features as readonly Feature[];
  }

  get djsClient() {
    return this.#djsClient;
  }

  get token() {
    return this.#token || null;
  }

  get options() {
    return this.#options;
  }

  get user() {
    return this.#djsClient?.user;
  }

  constructor() {}

  private isGuildAllowed(id: string) {
    const { include = [], exclude = [] } = this.#guildRules;
    if (include.length > 0 && !include.includes(id)) {
      return false;
    }
    if (exclude.length > 0 && exclude.includes(id)) {
      return false;
    }
    return true;
  }

  /** @internal Saves a cleanup handler for a feature in the #cleanupHandlers */
  private setCleanupHandler(feature: Feature, id: keyof CleanupHandlers, handler: Cleanup) {
    if (!handler) {
      return;
    }
    if (!this.#cleanupHandlers.has(feature)) {
      this.#cleanupHandlers.set(feature, {});
    }
    this.#cleanupHandlers.get(feature)![id] = handler;
  }

  /** @internal Runs a previously saved cleanup handler for a feature */
  private async runCleanupHandler(feature: Feature, id: keyof CleanupHandlers) {
    if (this.#cleanupHandlers.has(feature)) {
      const handlers = this.#cleanupHandlers.get(feature)!;
      if (handlers[id]) {
        await handlers[id]!();
        delete handlers[id];
      }
    }
  }

  /** @internal Resolves what gateway intents are desired using the `intents` hook. */
  private async resolveGatewayIntents() {
    return (
      await asyncMap(this.#features, feat =>
        typeof feat.intents === 'function' ? feat.intents.call(feat) : feat.intents
      )
    )
      .flat()
      .reduce((a: number, b) => a | (b ?? 0), 0);
  }

  // /** @internal */
  private async handleInteraction(i: APIInteraction) {
    const responseHandler = async (response: APIInteractionResponse) => {
      await rest.post(Routes.interactionCallback(i.id, i.token), {
        body: response,
        // TODO: handle file uploads for interaction responses.
        files: [],
      });
    };

    const interaction = createInteraction(i, responseHandler);

    // Run handlers
    (await asyncMap(this.#features, feat => feat.interaction?.call?.(feat, interaction))) //
      .forEach(response => response && responseHandler(toJSONValue(response as JSONValue)));
  }

  // TODO: fix types on this to not have that required `Event` type param, but whatever.
  /**
   * @internal Runs a lifecycle hook on an array of features. A lifecycle hook is one that may
   * return a cleanup handler, and such those handlers are saved using `.setCleanupHandler`.
   */
  private async runLifecycleHook<Event>(
    features: Feature[],
    hook: LifecycleHookNames,
    data?: Event
  ) {
    await asyncMap(features, async feat => {
      if (hook in feat) {
        // @ts-ignore
        const cleanup = await feat[hook]!.call(feat, data);
        this.setCleanupHandler(feat, hook, cleanup);
      }
    });
  }

  /** Starts the gateway bot. Run the first set of `.loadFeatures` _before_ using this. */
  async start(options: Immutable<GatewayBotOptions>) {
    this.#options = options;

    const include = getEnvVar('PURPLET_INCLUDE_GUILDS') ?? '';
    const exclude = getEnvVar('PURPLET_EXCLUDE_GUILDS') ?? '';

    if (include && exclude) {
      throw new Error('Cannot specify both PURPLET_INCLUDE_GUILDS and PURPLET_EXCLUDE_GUILDS');
    }
    this.#guildRules = {
      include: include ? include.split(',') : [],
      exclude: exclude ? exclude.split(',') : [],
    };

    // Remove after Node.js 16 is no longer in LTS
    const botReliesOnDJS = this.#features.some(featureRequiresDJS);

    // TODO: do not use process.env but something else. related to custom env solution.
    this.#token = getEnvVar('DISCORD_BOT_TOKEN') ?? '';
    if (this.#token) {
      rest.setToken(this.#token);
    } else {
      log(
        'error',
        dedent`
          No Discord token provided. Purplet cannot start up.
          Edit your ".env" file and add a line with the following:

          DISCORD_BOT_TOKEN="your token here"
        `
      );
      process.exit(1); // TODO: throw an error instead, and have cli handle printing and exiting.
    }

    const currentUser = (await rest.get(Routes.user())) as RESTGetAPICurrentUserResult;
    this.#id = currentUser.id;
    const currentApplication = (await rest.get(
      Routes.oauth2CurrentApplication()
    )) as RESTGetAPIOAuth2CurrentApplicationResult;

    if (!currentApplication.team && currentApplication.owner) {
      this.#owners = [currentApplication.owner];
    }
    if (currentApplication.team) {
      this.#owners = currentApplication.team.members.map(x => x.user);
    }

    if (this.#options.checkIfProductionBot !== false) {
      const globalCommands = (await rest.get(
        Routes.applicationCommands(this.#id)
      )) as RESTGetAPIApplicationCommandsResult;
      if (globalCommands.length !== 0) {
        await pauseSpinner(async () => {
          console.log();
          log(
            'warn',
            `The token provided is for ${currentUser.username}#${currentUser.discriminator} (${currentUser.id}), which has global commands set. Purplet's development mode is not compatible with global commands, and must be removed.`
          );
          const confirm = await inquirer.prompt({
            type: 'confirm',
            name: 'continue',
            message: `Delete ALL Global Application Commands?`,
          });
          if (confirm.continue) {
            await rest.put(Routes.applicationCommands(this.#id), {
              body: [],
            });
          } else {
            log('info', 'Aborting startup.');
            process.exit(1);
          }
        });
      }
    }

    await this.runLifecycleHook(this.#features, 'initialize');

    // Command Sync
    await this.updateApplicationCommands();

    // Discord.JS related initialization
    if (botReliesOnDJS) {
      // Resolve intents
      this.#currentIntents = await this.resolveGatewayIntents();

      // Start the client
      await this.restartDJSClient();
    }

    this.#running = true;
  }

  /** @internal */
  private async resolveApplicationCommands() {
    const list = (
      await asyncMap(
        this.#features,
        feat =>
          (typeof feat.applicationCommands === 'function'
            ? feat.applicationCommands.call(feat)
            : feat.applicationCommands) ?? []
      )
    ).flat();

    const toBeMerged = list.filter(
      x => x.type === ApplicationCommandType.ChatInput && x.name.includes(' ')
    );
    const commandNamesToBeMerged = [...new Set(toBeMerged.map(x => x.name.split(' ')[0]))];
    const rest = list.filter(x => !toBeMerged.includes(x));

    for (const name of commandNamesToBeMerged) {
      const cmd = rest.find(x => x.name === name);
      const merged = toBeMerged.filter(x =>
        x.name.startsWith(name + ' ')
      ) as RESTPostAPIChatInputApplicationCommandsJSONBody[];

      if (!cmd) {
        throw new Error(`Could not find slash command group "${name}"`);
      }
      const isTwoLevel = merged.some(x => x.name.split(' ').length === 3);

      if (isTwoLevel) {
        cmd.options = merged
          .filter(x => x.name.split(' ').length === 2)
          .map(x => ({
            name: x.name.split(' ')[1],
            type: ApplicationCommandOptionType.SubcommandGroup,
            description: x.description,
            name_localizations: x.name_localizations,
            description_localizations: x.description_localizations,
            options: merged
              .filter(x => x.name.split(' ').length === 3)
              .map(x => ({
                name: x.name.split(' ')[2],
                type: ApplicationCommandOptionType.Subcommand,
                description: x.description,
                name_localizations: x.name_localizations,
                description_localizations: x.description_localizations,
                options: x.options as APIApplicationCommandBasicOption[],
              })),
          }));
      } else {
        cmd.options = merged.map(x => ({
          name: x.name.split(' ')[1],
          type: ApplicationCommandOptionType.Subcommand,
          description: x.description,
          name_localizations: x.name_localizations,
          description_localizations: x.description_localizations,
          options: x.options as APIApplicationCommandBasicOption[],
        }));
      }
    }

    return rest;
  }

  /** @internal */
  private async updateApplicationCommands() {
    const commands = await this.resolveApplicationCommands();

    if (commands.length === 0) {
      return;
    }

    // Check for sameness, and if so, don't update.
    if (this.#cachedCommandData && deepEqual(commands, this.#cachedCommandData)) {
      return;
    }

    this.#cachedCommandData = commands;

    // In production, do nothing.
    if (this.#options.mode !== 'development') {
      return;
    }

    // Overwrite the global command data with nothing, but only on first load.
    // This line might cause a lot of people some problems. We need to ensure that the docs
    // scream at people to use separate development and production bots to avoid stuff like this.
    if (!this.#cachedCommandData) {
      await rest.put(Routes.applicationCommands(this.#id), { body: [] });
    }

    const guildList = (
      (await rest.get(Routes.userGuilds())) as RESTAPIPartialCurrentUserGuild[]
    ).filter(x => this.isGuildAllowed(x.id));

    if (guildList.length > 100) {
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
  }

  private async updateApplicationCommandsGuild(guild: Pick<APIGuild, 'name' | 'id'>) {
    if (!this.#cachedCommandData) {
      throw new Error('No command data cached. Call `.start` first.');
    }

    log('info', `Updating commands on ${guild.name}`);
    await rest.put(Routes.applicationGuildCommands(this.#id, guild.id), {
      body: this.#cachedCommandData,
    });
  }

  async updateApplicationCommandsGlobal() {
    if (!this.#cachedCommandData) {
      throw new Error('No command data cached. Call `.start` first.');
    }

    await rest.put(Routes.applicationCommands(this.#id), { body: this.#cachedCommandData });
  }

  /**
   * @internal Starts or Restarts the Discord.JS client, assuming that `.#currentDJSOptions` is
   * set.
   */
  private async restartDJSClient() {
    if (this.#options.gateway === false) {
      return;
    }

    if (this.#djsClient) {
      await this.#djsClient.destroy();
      setDJSClient(undefined!);
      log('info', 'Restarting Discord.JS client');
    } else {
      log('info', 'Starting Discord.JS client...');
    }

    // Construct and login client
    this.#djsClient = new Client({
      intents: this.#currentIntents,
    });
    setDJSClient(this.#djsClient);

    // Intercept all raw gateway events for the `gatewayEvent` hook.
    const wsEmit = this.#djsClient.ws.emit;
    this.#djsClient.ws.emit = (event: keyof GatewayEventHook, ...args: unknown[]) => {
      this.features.forEach(feature => {
        const handler = feature.gatewayEvent?.[event] as EventHook<unknown>;
        if (handler) {
          handler.call(feature, args[0]);
        }
      });

      return wsEmit.call(this.#djsClient!.ws, event, ...args);
    };

    // Listen for raw interaction events for the `interaction` hook.
    this.#djsClient.ws.on(GatewayDispatchEvents.InteractionCreate, async i => {
      this.handleInteraction(i);
    });

    if (this.#options.mode === 'development') {
      this.#djsClient.on('guildCreate', guild => {
        if (this.isGuildAllowed(guild.id)) {
          this.updateApplicationCommandsGuild(guild);
        }
      });
    }

    await this.#djsClient.login(this.#token);
  }

  /** @internal Re-runs `intent` and `djsConfig` hooks and returns a boolean if the Discord.js client should be restarted. */
  private async shouldRestartDJSClient() {
    // We do not do early returns as we still need to evaluate both the intents and the config.
    let mustRestart = false;

    const newIntents = await this.resolveGatewayIntents();
    if (newIntents !== this.#currentIntents) {
      mustRestart = true;
    }
    this.#currentIntents = newIntents;

    return mustRestart;
  }

  /**
   * Loads one or more features. This can be called after bot startup, and may restart the
   * Discord.js client, if the `intents` or `djsOptions` hooks produce changed outputs.
   */
  async loadFeatures(...features: Feature[]) {
    if (features.length === 0) {
      return;
    }

    this.#features.push(...features);

    if (!this.#running) {
      return;
    }

    await this.runLifecycleHook(features, 'initialize');

    await this.updateApplicationCommands();

    if (await this.shouldRestartDJSClient()) {
      // Restart the bot with new configuration
      await this.restartDJSClient();
    }
  }

  /** Unloads features. By default, this does not cause Discord.js to restart like loading features would. */
  async unloadFeatures(...features: Feature[]) {
    if (features.length === 0) {
      return;
    }

    if (this.#running) {
      await asyncMap(features, async feat => {
        await this.runCleanupHandler(feat, 'initialize');
      });
    }

    this.#features = this.#features.filter(feat => !features.includes(feat));
  }

  /** Unloads all features associated with a given filename. */
  unloadFeaturesFromFile(filename: string) {
    return this.unloadFeatures(...this.#features.filter(feat => feat.filename === filename));
  }

  /** Gracefully stop the bot. */
  async stop() {
    // Stop the bot
    if (this.#djsClient) {
      await this.#djsClient.destroy();
    }

    // Clear commands
    if (this.#options.mode === 'development') {
      const guildList = (await rest.get(Routes.userGuilds())) as RESTAPIPartialCurrentUserGuild[];

      await asyncMap(guildList, async guild => {
        await rest.put(Routes.applicationGuildCommands(this.#id, guild.id), {
          body: [],
        });
      });
    }

    this.#running = false;
  }
}
