import type { Immutable } from '@davecode/types';
import { APIGuild, RESTAPIPartialCurrentUserGuild, RESTGetAPICurrentUserGuildsResult, RESTGetAPICurrentUserResult, Routes } from 'discord-api-types/v10';
import { Client, Guild } from 'discord.js';
import { deepEqual } from 'fast-equals';
import type {
  ApplicationCommandData,
  DJSOptions,
  EventHook,
  Feature,
  GatewayEventHook,
  LifecycleHookNames,
} from './feature';
import { rest, setDJSClient } from './global';
import { featureRequiresDJS } from '../utils/feature';
import { asyncMap } from '../utils/promise';
import type { Cleanup } from '../utils/types';
import { getEnvVar } from './env';

// These `.call()`s are needed due to the way features are created
/* eslint-disable no-useless-call */

export interface GatewayBotOptions {
  /**
   * Mode. "production" or "development" depending on what state the bot code is in. If in
   * development, commands are only deployed to a specified set of test servers.
   */
  mode: 'production' | 'development';
}

interface CleanupHandlers {
  initialize?: Cleanup;
  djsClient?: Cleanup;
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
  #currentDJSOptions?: DJSOptions;
  #currentIntents: number = 0;
  #id: string = '';
  #cachedCommandData?: ApplicationCommandData[];

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

  constructor(readonly options: Immutable<GatewayBotOptions>) { }

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

  /**
   * @internal Resolves what options should be passed to Discord.js using the `djsOptions` hook.
   * Properly handles passing an object around and running the hooks in sequence.
   */
  private async resolveDJSOptions() {
    let clientOptions: DJSOptions = {};

    for (const feat of this.#features) {
      if (feat.djsOptions) {
        clientOptions = (await feat.djsOptions.call(feat, clientOptions)) ?? clientOptions;
      }
    }

    return { ...clientOptions, intents: this.#currentIntents };
  }

  // /** @internal */
  // private async handleInteraction(i: APIInteraction) {
  //   const responseHandler = async (response: APIInteractionResponse) => {
  //     await rest.post(Routes.interactionCallback(i.id, i.token), {
  //       body: response,
  //       // TODO: handle file uploads for interaction responses.
  //       files: [],
  //     });
  //   };

  //   const interaction = createInteraction(i, responseHandler);

  //   // Run handlers
  //   (await asyncMap(this.#features, feat => feat.interaction?.call?.(feat, interaction))) //
  //     .forEach(response => response && responseHandler(toJSONValue(response as JSONValue)));
  // }

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
  async start() {
    // Remove after Node.js 16 is no longer in LTS
    const botReliesOnDJS = this.#features.some(featureRequiresDJS);

    // TODO: do not use process.env but something else. related to custom env solution.
    this.#token = getEnvVar('DISCORD_BOT_TOKEN') ?? '';
    if (this.#token) {
      rest.setToken(this.#token);
    } else {
      console.warn('No Discord.JS token provided. Bot will not be online.');
      console.warn('Edit your ".env" file and add a line with the following:');
      console.warn();
      console.warn('DISCORD_BOT_TOKEN="your-token-here"');
      console.warn();
    }

    const currentUser = (await rest.get(Routes.user())) as RESTGetAPICurrentUserResult;
    this.#id = currentUser.id;

    await this.runLifecycleHook(this.#features, 'initialize');

    // Command Sync
    await this.updateApplicationCommands();

    // Discord.JS related initialization
    if (botReliesOnDJS) {
      // Resolve intents
      this.#currentIntents = await this.resolveGatewayIntents();

      // Resolve ClientOptions
      this.#currentDJSOptions = await this.resolveDJSOptions();

      // Start the client
      await this.restartDJSClient();
    }

    this.#running = true;
    const tag = `${currentUser.username}#${currentUser.discriminator}`;
    console.log(`Bot has finished starting up, logged in as @${tag}`);
  }

  /** @internal */
  private async resolveApplicationCommands() {
    return (
      await asyncMap(
        this.#features,
        feat =>
          (typeof feat.applicationCommands === 'function'
            ? feat.applicationCommands.call(feat)
            : feat.applicationCommands) ?? []
      )
    ).flat();
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

    // In production, do nothing.
    if (this.options.mode !== 'development') {
      return;
    }

    // Overwrite the global command data with nothing, but only on first load.
    // This line might cause a lot of people some problems. We need to ensure that the docs
    // scream at people to use separate development and production bots to avoid stuff like this.
    if (!this.#cachedCommandData) {
      await rest.put(Routes.applicationCommands(this.#id), { body: [] });
    }
    this.#cachedCommandData = commands;

    const guildList = await rest.get(Routes.userGuilds()) as RESTAPIPartialCurrentUserGuild[];

    await asyncMap(guildList, async guild => {
      this.updateApplicationCommandsGuild(guild);
    });
  }

  private async updateApplicationCommandsGuild(guild: Pick<APIGuild, 'name' | 'id'>) {
    console.log(`Updating commands on ${guild.name}`);
    await rest.put(Routes.applicationGuildCommands(this.#id, guild.id), {
      body: this.#cachedCommandData,
    });
  }

  /**
   * @internal Starts or Restarts the Discord.JS client, assuming that `.#currentDJSOptions` is
   * set.
   */
  private async restartDJSClient() {
    if (!this.#currentDJSOptions) {
      throw new Error('Cannot restart Discord.js client before initializing the configuration.');
    }

    if (this.#djsClient) {
      await this.#djsClient.destroy();
      setDJSClient(undefined!);
      console.log('Restarting Discord.JS client');
    } else {
      console.log('Starting Discord.JS client...');
    }

    // Cleanup the djsClient hook
    await asyncMap(this.#features, feat => this.runCleanupHandler(feat, 'djsClient'));

    // Construct and login client
    this.#djsClient = new Client({
      intents: this.#currentIntents,
      ...structuredClone(this.#currentDJSOptions),
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
    // this.#djsClient.ws.on(GatewayDispatchEvents.InteractionCreate, async i => {
    //   this.handleInteraction(i);
    // });
    this.#djsClient.on('interactionCreate', i => {
      this.features.forEach(feature => {
        feature.interaction?.(i);
      });
    });

    if (this.options.mode === 'development') {
      this.#djsClient.on('guildCreate', (guild) => {
        this.updateApplicationCommandsGuild(guild);
      });
    }

    await this.#djsClient.login(this.#token);

    // Run the djsClient hook
    await this.runLifecycleHook(this.#features, 'djsClient', this.#djsClient);
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

    // TODO: if ANY module uses `makeCache` or `jsonTransformer`, it will
    // reload DJS every time unless they can make sure to pass an IDENTICAL function.
    const newDJSOptions = await this.resolveDJSOptions();
    if (!deepEqual(newDJSOptions, this.#currentDJSOptions)) {
      mustRestart = true;
    }
    this.#currentDJSOptions = newDJSOptions;

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
    } else {
      // Run the djsClient hook
      await this.runLifecycleHook(features, 'djsClient', this.#djsClient!);
    }
  }

  /** Unloads features. By default, this does not cause Discord.js to restart like loading features would. */
  async unloadFeatures(...features: Feature[]) {
    if (features.length === 0) {
      return;
    }

    if (this.#running) {
      await asyncMap(features, async feat => {
        await this.runCleanupHandler(feat, 'djsClient');
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
    if (this.options.mode === 'development') {
      const guildList = process.env.UNSTABLE_PURPLET_COMMAND_GUILDS?.split(',');
      if (guildList) {
        await asyncMap(guildList, async guildId => {
          await rest.put(Routes.applicationGuildCommands(this.#id, guildId), {
            body: [],
          });
        });
      }
    }

    this.#running = false;
  }
}
