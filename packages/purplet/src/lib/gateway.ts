import type * as DJS from 'discord.js';
import {
  DJSClientEvent,
  FeatureEvent,
  featureRequiresDJS,
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
  private djs?: DJS.Client;
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
      await asyncMap(
        this.features,
        async feat =>
          (feat.gatewayIntents && (await feat.gatewayIntents({ featureId: feat.featureId }))) ?? 0
      )
    ).reduce((a, b) => a + b, 0);
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

    // Discord.JS related initialization
    if (botReliesOnDJS) {
      // I use this async import to make sure that the purplet build won't load discord.js
      // regardless of whether it's actually being used or not.
      const Discord = await import('discord.js');

      // Resolve intents
      this.currentGatewayIntents = await this.resolveGatewayIntents();

      // Resolve ClientOptions
      this.currentDJSOptions = await this.resolveDJSOptions();

      // Construct client
      this.djs = new Discord.Client(this.currentDJSOptions);
      await this.djs.login(process.env.DISCORD_BOT_TOKEN);

      // Client hook
      await this.runLifecycleHook<DJSClientEvent>(this.features, 'djsClient', { client: this.djs });
    }

    this.initialized = true;
  }

  async loadFeatures(...feature: InternalFeature[]) {
    this.features.push(...feature);

    if (this.initialized) {
      // TODO
      console.warn(`NOT IMPLEMENTED - Trying to load features after initialization.`);
    }
  }

  async unloadFeatures(...feature: InternalFeature[]) {
    if (this.initialized) {
      await Promise.all(
        feature.map(async feat => {
          await this.runCleanupHandler(feat, 'djsClient');
          await this.runCleanupHandler(feat, 'initialize');
        })
      );
    }
    this.features = this.features.filter(feat => !feature.includes(feat));
  }

  unloadModulesFromFile(filename: string) {
    return this.unloadFeatures(...this.features.filter(feat => feat.filename === filename));
  }
}
