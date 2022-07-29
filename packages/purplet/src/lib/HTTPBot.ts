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

  // async handleInteraction(i: APIInteraction): Promise<APIInteractionResponse> {
  //   throw new Error('Method not implemented.');
  // }

  patchFeatures({ add, remove }: PatchFeatureInput) {
    this.features.remove(remove);
    this.features.add(add);
  }
}
