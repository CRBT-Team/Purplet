import type * as DJS from 'discord.js';
import { deepEqual } from 'fast-equals';
import type {
  DJSClientEvent,
  Feature,
  FeatureEvent,
  InitializeEvent,
  LifecycleHookNames,
} from './feature';
import { featureRequiresDJS } from '../utils/feature';
import { asyncMap } from '../utils/promise';
import type { Cleanup } from '../utils/types';

export interface GatewayBotOptions {
  mode?: 'production' | 'development';
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
  #features: Feature[] = [];
  #cleanupHandlers = new WeakMap<Feature, CleanupHandlers>();
  #djsModule?: typeof DJS;
  #djsClient?: DJS.Client;
  #currentDJSOptions?: DJS.ClientOptions;
  #currentIntents: number = 0;

  get running() {
    return this.#running;
  }

  get features() {
    return this.#features as readonly Feature[];
  }

  get djsClient() {
    return this.#djsClient;
  }

  constructor(options: GatewayBotOptions) {}

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
        typeof feat.intents === 'function'
          ? feat.intents({ featureId: feat.featureId })
          : feat.intents
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
    let clientOptions: DJS.ClientOptions = { intents: this.#currentIntents };

    for (const feat of this.#features) {
      if (feat.djsOptions) {
        clientOptions =
          (await feat.djsOptions({
            featureId: feat.featureId,
            options: clientOptions,
          })) ?? clientOptions;
      }
    }

    return clientOptions;
  }

  // TODO: fix types on this to not have that required `Event` type param, but whatever.
  /**
   * @internal Runs a lifecycle hook on an array of features. A lifecycle hook is one that may
   * return a cleanup handler, and such those handlers are saved using `.setCleanupHandler`.
   */
  private async runLifecycleHook<Event extends FeatureEvent>(
    features: Feature[],
    hook: LifecycleHookNames,
    data: Omit<Event, 'featureId'>
  ) {
    await asyncMap(features, async feat => {
      if (hook in feat) {
        const cleanup = await feat[hook]!({
          featureId: feat.featureId,
          ...data,
        } as any);
        this.setCleanupHandler(feat, hook, cleanup);
      }
    });
  }

  /** Starts the gateway bot. Run the first set of `.loadFeatures` _before_ using this. */
  async start() {
    const botReliesOnDJS = this.#features.some(featureRequiresDJS);

    await this.runLifecycleHook<InitializeEvent>(this.#features, 'initialize', {});

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
      console.log('Restarting Discord.JS client');
    } else {
      console.log('Starting Discord.JS client...');
    }

    // I use this async import to make sure that the purplet build won't load discord.js
    // regardless of whether it's actually being used or not.
    const Discord = this.#djsModule ?? (await import('discord.js'));

    // Cleanup the djsClient hook
    await asyncMap(this.#features, feat => this.runCleanupHandler(feat, 'djsClient'));

    // Construct and login client
    this.#djsClient = new Discord.Client(structuredClone(this.#currentDJSOptions));
    await this.#djsClient.login(process.env.DISCORD_BOT_TOKEN);

    // Run the djsClient hook
    await this.runLifecycleHook<DJSClientEvent>(this.#features, 'djsClient', {
      client: this.#djsClient,
    });
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

    await this.runLifecycleHook<InitializeEvent>(features, 'initialize', {});

    if (await this.shouldRestartDJSClient()) {
      // Restart the bot with new configuration
      await this.restartDJSClient();
    } else {
      // Run the djsClient hook
      await this.runLifecycleHook<DJSClientEvent>(features, 'djsClient', {
        client: this.#djsClient!,
      });
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
}
