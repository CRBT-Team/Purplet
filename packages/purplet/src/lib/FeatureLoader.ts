import type { Feature } from './hook';
import { FEATURE } from './hook';

export class FeatureLoader {
  #features: Feature[] = [];

  get features() {
    return this.#features as readonly Feature[];
  }

  constructor() {}

  add(features: Feature[]) {
    const newFeatures = features
      .map(x => (x[FEATURE].hook.merge ? (x[FEATURE].data as Feature[]) : x))
      .flat()
      .filter(feature => !this.#features.includes(feature));

    this.#features.push(...newFeatures);

    return newFeatures;
  }

  remove(features: Feature[]) {
    const removedFeatures = features
      .map(x => (x[FEATURE].hook.merge ? (x[FEATURE].data as Feature[]) : x))
      .flat()
      .filter(feature => this.#features.includes(feature));

    this.#features = this.#features.filter(feature => !removedFeatures.includes(feature));

    return removedFeatures;
  }
}
