import type * as DJS from 'discord.js';
import type { Awaitable } from '@davecode/types';
import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import type { Cleanup } from '../utils/types';

const IS_FEATURE = Symbol.for('purplet.is-bot-feature');

export type LifecycleHook<E> = (this: Feature, event: E) => Awaitable<Cleanup>;
export type EventHook<E, R = void> = (this: Feature, ctx: E) => Awaitable<R>;
export type SequentialHook<E, R = void> = (this: Feature, ctx: E) => Awaitable<R>;

export type DJSOptions = Omit<DJS.ClientOptions, 'intents'>;
export type ApplicationCommandData = RESTPostAPIApplicationCommandsJSONBody;

export type IntentResolvable = number | number[];

/**
 * A feature represents anything that contributes to the bot's functionality. In purplet, features
 * achieve action through a small set of hooks that let you tie into Discord.js and Purplet's own
 * API. They look very similar to vite and rollup plugins.
 *
 * Also, there is some extra data about your feature available as `this` inside of the hooks, so I'd
 * stray away from using arrow functions for that, plus it looks nicer with the method shorthand.
 */
export interface FeatureData {
  /** Name of this feature, as see in some debug menus. */
  name: string;
  /**
   * This is the first hook that is called for your bot, and is always called. This hook allows for
   * a cleanup function, which you should use to remove event handlers.
   */
  initialize?: LifecycleHook<void>;
  /**
   * Called on load with a Discord.js client. Specifying this hook will cause the Discord.js client
   * to be setup. This hook allows for a cleanup function, which you should use to remove event handlers.
   */
  djsClient?: LifecycleHook<DJS.Client>;
  /**
   * Called before the Discord.js client is created, passing a configuration object. You are able to
   * return or modify the configuration object, and that will be passed to Discord.js. Do not
   * configure gateway intents with this hook, and use the separate gateway intents hook instead.
   *
   * Note: this hook will only be called if some feature in your project requests the Discord.js client.
   */
  djsOptions?: EventHook<DJSOptions, DJSOptions | void>;
  /**
   * Called for incoming interactions, and does not explicity rely on Discord.js, meaning bots using
   * this hook can theoretically be deployed to a cloud function and called over HTTPs.
   */
  interaction?: EventHook<unknown>;
  /**
   * Called to resolve this feature's application commands. Note that this requires raw command
   * objects, as per the Discord API, NOT Discord.js types and classes.
   */
  applicationCommands?: EventHook<void, ApplicationCommandData[]>;
  /**
   * This hook allows you to specify what gateway intents your gateway bot requires. Does not assume
   * a Discord.js environment, and will trigger on either using Discord.js, or the `gatewayEvents` hook.
   */
  intents?: EventHook<void, IntentResolvable | void> | IntentResolvable;
}

/** Represents feature data that has gone through `createFeature` but not annotated by `moduleToFeatureArray`. */
export interface MarkedFeature extends FeatureData {
  [IS_FEATURE]: true;
}

/** Represents a fully anno. */
export interface Feature extends FeatureData {
  [IS_FEATURE]: true;

  /** The full path to this module's source file. */
  filename: string;
  /** The id of the export that contained this feature. */
  exportId: string;
  /** A generated ID based on the `filename` and `exportId`. */
  featureId: string;
}

// TODO: use dyanmic types to get this, i couldn't figure it out in the time I had.
export type LifecycleHookNames = 'initialize' | 'djsClient';

/** `createFeature` annotates a FeatureData with a symbol used to mark what object is actually a Feature. */
export function createFeature(data: FeatureData): MarkedFeature {
  return {
    [IS_FEATURE]: true,
    ...data,
  };
}

/**
 * Returns true if a value is a `Feature` (this doesn't check annotation state, but it's type
 * returned will be `Feature` regardless). The subtle cast is in place, since most of the time, the
 * feature has already been annotated.
 */
export function isFeature(feature: unknown): feature is Feature {
  return ((feature && (feature as Feature)[IS_FEATURE]) || false) as boolean;
}
