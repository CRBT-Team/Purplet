// The following custom hooks are all extremely simple, and wrap around the built-in hooks.
/* eslint-disable no-redeclare */
import type * as DJS from 'discord.js';
import { createFeature, DJSOptions, FeatureData, IntentResolvable, MarkedFeature } from './feature';
import type { Cleanup } from '../utils/types';

// TODO: This function's types
/** This hook allows you to listen for a Discord.js client event. */
export function $onDJSEvent(eventName: string, handler: (...args: any[]) => void) {
  return createFeature({
    name: `discord.js on("${eventName}") handler`,

    djsClient({ client }) {
      client.on(eventName, handler);
      return () => client.off(eventName, handler);
    },
  });
}

/**
 * This hook allows you to specify what gateway intents your gateway bot requires. Does not assume a
 * Discord.js environment, and will trigger on either using Discord.js, or the `gatewayEvents` hook.
 *
 * Takes either one or more intents (numbers, see `GatewayIntentBits` from `discord-api-types`), one
 * or more arrays of intents, or a function returning that.
 */
export function $intents(...intents: IntentResolvable[]): MarkedFeature;
export function $intents(intents: FeatureData['intents']): MarkedFeature;
export function $intents(first: FeatureData['intents'], ...rest: IntentResolvable[]) {
  return createFeature({
    name: 'required intents',
    intents: typeof first === 'function' ? first : rest.flat(),
  });
}

export interface ServiceOptions {
  name?: string;
  start(): Cleanup;
  stop?(): void;
}

/**
 * A service is a way to run some code alongside your bot in a hot-reloadable way. The function
 * called starts the service, and returns a stopping function. Alternatively, you can pass both a
 * start and stop function if that is easier.
 */
export function $service({ name, start, stop }: ServiceOptions) {
  return createFeature({
    name: name || 'unnamed service',
    async initialize() {
      const cleanup = await start();

      return () => {
        cleanup?.();
        stop?.();
      };
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
        : ({ options: previousOptions }) => ({ ...previousOptions, ...options }),
  });
}

/**
 * This hook allows you to pass in presence data. It is run only once at startup.
 *
 * This is a wrapper around `$djsOptions` and passing a `presence` object.
 */
export function $presence(presence: DJS.PresenceData) {
  return $djsOptions({ presence });
}
