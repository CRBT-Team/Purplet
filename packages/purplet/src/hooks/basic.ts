// TODO: This function's types

import { createFeature, DJSOptions, FeatureData } from '../lib/feature';

/** This hook allows you to listen for a Discord.js client event. */
export function $onDJSEvent(eventName: string, handler: (...args: any[]) => void) {
  return createFeature({
    name: `discord.js on("${eventName}") handler`,

    djsClient(client) {
      client.on(eventName, handler);
      return () => client.off(eventName, handler);
    },
  });
}

/** This hook allows you to modify the Discord.js configuration. You cannot pass `intents` here, see $intents. */
export function $djsOptions(options: FeatureData['djsOptions'] | DJSOptions) {
  return createFeature({
    name: 'discord.js options',
    djsOptions:
      typeof options === 'function'
        ? options
        : previousOptions => ({ ...previousOptions, ...options }),
  });
}

export function $interaction(handler: FeatureData['interaction']) {
  return createFeature({
    name: 'interaction handler',
    interaction: handler,
  });
}
