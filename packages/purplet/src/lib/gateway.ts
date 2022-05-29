import type * as DJS from 'discord.js';
import { deepEqual } from 'fast-equals';
import {
  DJSClientEvent,
  FeatureEvent,
  featureRequiresDJS,
  InitializeEvent,
  InternalFeature,
  LifecycleHookNames,
} from './feature';
import { asyncMap } from '../utils/promise';
import type { Cleanup } from '../utils/types';

interface CleanupHandlers {
  initialize?: Cleanup;
  djsClient?: Cleanup;
}

export class GatewayBot {
  initialized = false;
  features: InternalFeature[] = [];

  private cleanupHandlers = new WeakMap<InternalFeature, CleanupHandlers>();
  private DJS?: typeof DJS;
  private djsClient?: DJS.Client;
  private currentDJSOptions?: DJS.ClientOptions;
  private currentGatewayIntents: number = 0;

  constructor() {}

  private setCleanupHandler(feature: InternalFeature, id: keyof CleanupHandlers, handler: Cleanup) {
    if (!handler) {
      return;
    }
    if (!this.cleanupHandlers.has(feature)) {
      this.cleanupHandlers.set(feature, {});
    }
    this.cleanupHandlers.get(feature)![id] = handler;
  }

  private async runCleanupHandler(feature: InternalFeature, id: keyof CleanupHandlers) {
    if (this.cleanupHandlers.has(feature)) {
      const handlers = this.cleanupHandlers.get(feature)!;
      if (handlers[id]) {
        await handlers[id]!();
        delete handlers[id];
      }
    }
  }

  private async resolveGatewayIntents() {
    return (
      await asyncMap(this.features, async feat =>
        typeof feat.gatewayIntents === 'function'
          ? feat.gatewayIntents({ featureId: feat.featureId })
          : feat.gatewayIntents
      )
    )
      .flat()
      .reduce((a: number, b) => a | (b ?? 0), 0);
  }

  private async resolveDJSOptions() {
    let clientOptions: DJS.ClientOptions = { intents: this.currentGatewayIntents };

    for (const feat of this.features) {
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
  private async runLifecycleHook<Event extends FeatureEvent>(
    features: InternalFeature[],
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

  async initialize() {
    const botReliesOnDJS = this.features.some(featureRequiresDJS);

    await this.runLifecycleHook<InitializeEvent>(this.features, 'initialize', {});

    // Discord.JS related initialization
    if (botReliesOnDJS) {
      // Resolve intents
      this.currentGatewayIntents = await this.resolveGatewayIntents();

      // Resolve ClientOptions
      this.currentDJSOptions = await this.resolveDJSOptions();

      // Start the client
      await this.restartDJSClient();
    }

    this.initialized = true;
  }

  private async restartDJSClient() {
    if (!this.currentDJSOptions) {
      throw new Error('Cannot restart Discord.js client before initializing the configuration.');
    }

    if (this.djsClient) {
      await this.djsClient.destroy();
      console.log('Restarting Discord.JS client');
    } else {
      console.log('Starting Discord.JS client...');
    }

    // I use this async import to make sure that the purplet build won't load discord.js
    // regardless of whether it's actually being used or not.
    const Discord = this.DJS ?? (await import('discord.js'));

    // Cleanup the djsClient hook
    await asyncMap(this.features, async feat => this.runCleanupHandler(feat, 'djsClient'));

    // Construct and login client
    this.djsClient = new Discord.Client(structuredClone(this.currentDJSOptions));
    await this.djsClient.login(process.env.DISCORD_BOT_TOKEN);

    // Run the djsClient hook
    await this.runLifecycleHook<DJSClientEvent>(this.features, 'djsClient', {
      client: this.djsClient,
    });
  }

  async loadFeatures(...features: InternalFeature[]) {
    this.features.push(...features);

    if (!this.initialized) {
      return;
    }

    await this.runLifecycleHook<InitializeEvent>(features, 'initialize', {});

    let mustRestartDJS = false;

    const newIntents = await this.resolveGatewayIntents();
    if (newIntents !== this.currentGatewayIntents) {
      mustRestartDJS = true;
    }

    this.currentGatewayIntents = newIntents;
    // TODO: if ANY module uses `makeCache` or `jsonTransformer`, it will
    // reload DJS every time unless they can make sure to pass an IDENTICAL function.
    const newDJSOptions = await this.resolveDJSOptions();
    if (!deepEqual(newDJSOptions, this.currentDJSOptions)) {
      mustRestartDJS = true;
    }

    if (mustRestartDJS) {
      // Restart the bot with new configuration
      this.currentDJSOptions = newDJSOptions;
      await this.restartDJSClient();
    } else {
      // Run the djsClient hook
      await this.runLifecycleHook<DJSClientEvent>(features, 'djsClient', {
        client: this.djsClient!,
      });
    }
  }

  async unloadFeatures(...features: InternalFeature[]) {
    if (this.initialized) {
      await asyncMap(features, async feat => {
        await this.runCleanupHandler(feat, 'djsClient');
        await this.runCleanupHandler(feat, 'initialize');
      });
    }

    this.features = this.features.filter(feat => !features.includes(feat));
  }

  unloadModulesFromFile(filename: string) {
    return this.unloadFeatures(...this.features.filter(feat => feat.filename === filename));
  }
}
