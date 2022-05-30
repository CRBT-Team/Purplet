import { Feature, isFeature } from './feature';

/**
 * Converts a module of type `Record<string, MarkedFeature | unknown>` into an array of its
 * `Feature`s, annotating them in the process.
 */
export function moduleToFeatureArray(filename: string, module: Module) {
  return Object.entries(module)
    .filter(([key, value]) => isFeature(value))
    .map(([key, value]) => {
      const feature = value as Feature;
      feature.filename = filename;
      feature.exportId = key;
      const filenameWithoutExtension = filename.replace(/\.[^.]+$/, '');
      // I would hash this to get a smaller ID, but I'm scared of collisions.
      // Two modules on the same ID could break certain situations with Buttons
      feature.featureId = `${filenameWithoutExtension.toLowerCase()}#${key}`;
      return feature;
    });
}

/** Returns weather or not a `Feature` depends on Discord.JS to be present. */
export function featureRequiresDJS(feature: Feature): boolean {
  // Note: for now interactions are done through discord.js, so we need that.
  return 'djsClient' in feature || 'interaction' in feature;
}
