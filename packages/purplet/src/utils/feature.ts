import type { Module } from './types';
import { Feature, FEATURE } from '../lib/hook';

/**
 * Converts a module of type `Record<string, MarkedFeature | unknown>` into an array of its
 * `Feature`s, annotating them in the process.
 */
export function moduleToFeatureArray(filename: string, module: Module) {
  return Object.entries(module)
    .filter(([, value]) => !!(value as any)[FEATURE])
    .map(([key, value]) => {
      const feature = value as Feature;
      feature.filename = filename;
      feature.exportId = key;
      const filenameWithoutExtension = filename.replace(/\.[^.]+$/, '');
      // I would hash this to get a smaller ID, but I'm scared of collisions.
      // Two modules on the same ID could break certain situations with Buttons
      feature.featureId = `${filenameWithoutExtension.toLowerCase()}#${key}`;

      if (feature[FEATURE].hook.merge) {
        (feature[FEATURE].data as Feature[]).forEach((subFeature, i) => {
          subFeature.filename = filename;
          subFeature.exportId = `${key}[${i}]`;
          subFeature.featureId = `${feature.featureId}[${i}]`;
        });
      }

      return feature;
    });
}
