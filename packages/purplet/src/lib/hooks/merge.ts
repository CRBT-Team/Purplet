import { createFeature, FeatureData, GatewayEventHook, MarkedFeature } from '../feature';
import { asyncMap } from '../../utils/promise';

/** Merges one or more feature into a single feature object. */
export function $merge(...input: (MarkedFeature | false | null | undefined)[]) {
  const features = input.filter(Boolean) as MarkedFeature[];
  if (features.length === 0) {
    return createFeature({ name: 'empty merge' });
  }
  if (features.length === 1) {
    return features[0];
  }

  const newFeature: FeatureData = {
    name: 'merged features',
  };

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

  if (features.some(feature => feature.djsOptions)) {
    newFeature.djsOptions = async function (currentConfig) {
      for (const feature of features) {
        if (feature.djsOptions) {
          currentConfig = (await feature.djsOptions.call(this, currentConfig)) ?? currentConfig;
        }
      }
      return currentConfig;
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

  if (features.some(feature => feature.djsClient)) {
    newFeature.djsClient = async function (djsClient) {
      const cleanup = await asyncMap(features, f => f.djsClient?.call(this, djsClient));
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
