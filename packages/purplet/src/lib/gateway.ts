import type * as DJS from 'discord.js';
import { featureRequiresDJS, InternalFeature } from './feature';
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

  async initialize() {
    await Promise.all(
      this.features.map(async feat => {
        if (feat.initialize) {
          const cleanup = await feat.initialize({
            featureId: feat.featureId,
          });
          this.setCleanupHandler(feat, 'initialize', cleanup);
        }
      })
    );

    const botReliesOnDJS = this.features.some(featureRequiresDJS);

    // Discord.JS related initialization
    if (botReliesOnDJS) {
      // I use this async import to make sure that the purplet build won't load discord.js
      // regardless of whether it's actually being used or not.
      const DJS = await import('discord.js');

      // Resolve intents
      const intents = (
        await Promise.all(
          this.features.map(async feat => {
            return (
              (feat.gatewayIntents && (await feat.gatewayIntents({ featureId: feat.featureId }))) ??
              0
            );
          })
        )
      ).reduce((a, b) => a + b, 0);

      console.log(`Initializing Discord.JS client with intents: ${intents}`);

      // Resolve ClientOptions
      let clientOptions: DJS.ClientOptions = { intents };
      for (const feat of this.features) {
        if (feat.djsOptions) {
          clientOptions =
            (await feat.djsOptions({
              featureId: feat.featureId,
              options: clientOptions,
            })) ?? clientOptions;
        }
      }

      // Construct client
      this.djs = new DJS.Client(clientOptions);
      await this.djs.login(process.env.DISCORD_BOT_TOKEN);

      // Client hook
      await Promise.all(
        this.features.map(async feat => {
          if (feat.djsClient) {
            const cleanup = await feat.djsClient({
              featureId: feat.featureId,
              client: this.djs!,
            });
            this.setCleanupHandler(feat, 'djsClient', cleanup);
          }
        })
      );
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
