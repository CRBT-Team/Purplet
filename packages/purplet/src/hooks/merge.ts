import { createFeature, FeatureData, GatewayEventHook, MarkedFeature } from '../lib/feature';
import { asyncMap } from '../utils/promise';

/** Merges one or more feature into a single feature object. */
export function $merge(...input: (FeatureData | MarkedFeature | false | null | undefined)[]) {
  const features = input.filter(Boolean) as FeatureData[];
  if (features.length === 0) {
    return createFeature({});
  }
  if (features.length === 1) {
    return features[0];
  }

  const newFeature: FeatureData = {};

  if (features.some(feature => feature.applicationCommands)) {
    newFeature.applicationCommands = async function () {
      return (
        await asyncMap(
          features,
          ({ applicationCommands }) =>
            (typeof applicationCommands === 'function'
              ? applicationCommands.call(this)
              : applicationCommands) ?? []
        )
      )
        .filter(Boolean)
        .flat();
    };
  }

  if (features.some(feature => feature.intents)) {
    newFeature.intents = async function () {
      return (
        await asyncMap(
          features,
          ({ intents }) => (typeof intents === 'function' ? intents.call(this) : intents) ?? 0
        )
      ).flat();
    };
  }

  if (features.some(feature => feature.initialize)) {
    newFeature.initialize = async function () {
      const cleanup = await asyncMap(features, f => f.initialize?.call(this));
      return () => asyncMap(cleanup, f => f && f());
    };
  }

  if (features.some(feature => feature.interaction)) {
    newFeature.interaction = async function (interaction) {
      return (await asyncMap(features, f => f.interaction?.call(this, interaction))).find(Boolean);
    };
  }

  if (features.some(feature => feature.gatewayEvent)) {
    newFeature.gatewayEvent = {};
    const keys = [
      ...new Set(features.map(f => Object.keys(f.gatewayEvent ?? {}))),
    ].flat() as (keyof GatewayEventHook)[];

    for (const key of keys) {
      newFeature.gatewayEvent[key] = async function (event) {
        return (
          await asyncMap(features, f => (f.gatewayEvent as any)?.[key]?.call(this, event))
        ).find(Boolean);
      };
    }
  }

  return createFeature(newFeature);
}
