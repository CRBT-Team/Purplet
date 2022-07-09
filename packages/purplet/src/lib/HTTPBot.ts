import type { APIInteraction, APIInteractionResponse } from 'purplet/types';
import { FeatureLoader } from './FeatureLoader';
import type { PatchFeatureInput } from './GatewayBot';
import type { Feature } from './hook';

export interface HTTPBotOptions {
  features?: Feature[];
}

export class HTTPBot {
  features = new FeatureLoader();

  constructor(readonly options: HTTPBotOptions) {
    if (this.options.features) {
      this.features.add(this.options.features);
    }
  }

  async handleInteraction(i: APIInteraction): Promise<APIInteractionResponse> {
    throw new Error('Method not implemented.');
  }

  async patchFeatures({ add, remove }: PatchFeatureInput) {
    await this.features.remove(remove);
    await this.features.add(add);
  }
}
