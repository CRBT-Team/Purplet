import { FEATURE, Feature } from './hook';

export class FeatureLoader {
  #features: Feature[] = [];

  get features() {
    return this.#features.filter(feature => feature[FEATURE].hook.core);
  }

  constructor() {}

  async add(features: Feature[]) {
    const newFeatures = features
      .map(x => (x[FEATURE].hook.merge ? (x[FEATURE].data as Feature[]) : x))
      .flat()
      .filter(feature => !this.#features.includes(feature));

    for (const feat of newFeatures) {
      if (!feat[FEATURE].hook.core) {
        throw new Error('non-core features are not supported yet.');
      }
    }

    this.#features.push(...newFeatures);

    return newFeatures;
  }

  async remove(features: Feature[]) {
    const removedFeatures = features
      .map(x => (x[FEATURE].hook.merge ? (x[FEATURE].data as Feature[]) : x))
      .flat()
      .filter(feature => this.#features.includes(feature));

    for (const feat of removedFeatures) {
      if (!feat[FEATURE].hook.core) {
        throw new Error('non-core features are not supported yet.');
      }
    }

    this.#features = this.#features.filter(feature => !removedFeatures.includes(feature));

    return removedFeatures;
  }
}
