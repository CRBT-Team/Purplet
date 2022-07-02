import {
  GatewayDispatchEvents,
  GatewayDispatchPayload,
  GatewayIntentBits,
  GatewayPresenceUpdateData,
  Routes,
} from 'discord.js';
import { deepEqual } from 'fast-equals';
import { $dispatch, $initialize, $intents, $interaction, $presence } from './core-hooks';
import { FeatureLoader } from './FeatureLoader';
import { GatewayClient } from './GatewayClient';
import type { Feature } from './hook';
import { runHook } from './run-hook';
import { rest } from '../global';
import { createInteraction, InteractionResponse } from '../../structures';
import type { Cleanup } from '../../utils/types';

interface GatewayBotOptions {
  token: string;
  shard: [shard_id: number, shard_count: number];
}

export interface PatchFeatureInput {
  add: Feature[];
  remove: Feature[];
}

/**
 * GatewayBot is a class that contains a feature loader and a gateway client, and properly
 * implements the 6 core hooks.
 */
export class GatewayBot2 {
  features = new FeatureLoader();
  client: GatewayClient | null = null;

  #running = false;
  #cleanupInitializeHook: Cleanup;
  #cachedIntents?: GatewayIntentBits;
  #cachedPresence?: GatewayPresenceUpdateData;

  constructor(readonly options: GatewayBotOptions) {}

  async start() {
    if (this.#running) throw new Error('GatewayBot is already running');
    this.#cleanupInitializeHook = await this.features.runHook($initialize, undefined);
    await this.startClient();
  }

  private async startClient() {
    // Get gateway configuration
    const [intents, presence] = await Promise.all([
      this.#cachedIntents ?? this.features.runHook($intents, (a, b) => a | b, 0),
      this.#cachedPresence ??
        this.features.runHook($presence, (a, b) => ({ ...a, ...b }), undefined!),
    ]);

    this.#cachedIntents = intents;
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
      this.features.runHook($dispatch, payload);
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

      this.features.runHook($interaction, interaction);
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

    await runHook(coreFeaturesAdded, $initialize, undefined);

    const newIntents = await this.features.runHook($intents, (a, b) => a | b, 0);
    const newPresence = await this.features.runHook(
      $presence,
      (a, b) => ({ ...a, ...b }),
      undefined!
    );

    if (newIntents !== this.#cachedIntents) {
      await this.client?.close();
      await this.startClient();
    } else if (!deepEqual(newPresence, this.#cachedPresence)) {
      this.client?.updatePresence(newPresence);
    }
  }
}
