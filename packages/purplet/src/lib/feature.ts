import type * as DJS from 'discord.js';
import type { Awaitable } from '@davecode/types';
import type { GatewayDispatchEvents } from 'discord-api-types/gateway';
import type { Cleanup, Module } from '../utils/types';

const IS_BOT_FEATURE = Symbol.for('purplet.is-bot-feature');

export interface Feature extends FeatureHooks {
  [IS_BOT_FEATURE]: true;
  name: string;
}

export interface FeatureEvent {
  /**
   * Unique ID based on the filename and export name that the user defines a feature in. This can be
   * used to auto-generate the `custom_id` field for Discord message components, or do other things.
   */
  featureId: string;
}

export type LifecycleHook<E extends FeatureEvent> = (ctx: E) => Awaitable<Cleanup>;
export type EventHook<E extends FeatureEvent, R = void> = (ctx: E) => Awaitable<R>;

export interface InitializeEvent extends FeatureEvent {}

export interface DJSClientEvent extends FeatureEvent {
  client: DJS.Client;
}

export interface DJSOptionsEvent extends FeatureEvent {
  options: DJS.ClientOptions;
}

export interface GatewayIntentsEvent extends FeatureEvent {}

export interface InteractionEvent extends FeatureEvent {
  interaction: unknown;
}

export interface GatewayEvent extends FeatureEvent {
  data: unknown;
}

export interface FeatureHooks {
  /**
   * This is the first hook that is called for your bot, and is always called. This hook allows for
   * a cleanup function, which you should use to remove event handlers.
   */
  initialize?: LifecycleHook<InitializeEvent>;
  /**
   * Called on load with a Discord.js client. Specifying this hook will cause the Discord.js client
   * to be setup. This hook allows for a cleanup function, which you should use to remove event handlers.
   */
  djsClient?: LifecycleHook<DJSClientEvent>;
  /**
   * Called before the Discord.js client is created, passing a configuration object. You are able to
   * return or modify the configuration object, and that will be passed to Discord.js. Do not
   * configure gateway intents with this hook, and use the separate gateway intents hook instead.
   *
   * Note: this hook will only be called if some feature in your project requests the Discord.js client.
   */
  djsOptions?: EventHook<DJSOptionsEvent, DJS.ClientOptions | void>;
  /**
   * Called for incoming interactions, and does not explicity rely on Discord.js, meaning bots using
   * this hook can theoretically be deployed to a cloud function and called over HTTPs.
   */
  interaction?: EventHook<InteractionEvent>;
  /**
   * This hook allows you to specify what gateway intents your gateway bot requires. Does not assume
   * a Discord.js environment, and will trigger on either using Discord.js, or the `gatewayEvents` hook.
   */
  gatewayIntents?: EventHook<GatewayIntentsEvent, number | void>;
  /**
   * Unknown how this will exactly work, but this is an alternative to using discord.js for the
   * gateway. Handle raw events. I'm not sure.
   */
  gatewayEvents?: { [K in GatewayDispatchEvents]?: EventHook<GatewayEvent> };
}

export function createFeature(name: string, hooks: FeatureHooks) {
  return {
    [IS_BOT_FEATURE]: true,
    name,
    ...hooks,
  };
}

export function isBotFeature(feature: unknown): feature is Feature {
  return ((feature && (feature as Feature)[IS_BOT_FEATURE]) || false) as boolean;
}

export interface InternalFeature extends Feature {
  filename: string;
  exportId: string;
  featureId: string;
}

/** Converts a module of features (and other exports) into an array of its `Feature`s. */
export function moduleToFeatureArray(filename: string, module: Module) {
  return Object.entries(module)
    .filter(([key, value]) => isBotFeature(value))
    .map(([key, value]) => {
      const feature = value as InternalFeature;
      feature.filename = filename;
      feature.exportId = key;
      feature.featureId = `${filename}#${key}`;
      return feature;
    });
}

export function featureRequiresDJS(feature: FeatureHooks): boolean {
  return !!feature.djsClient;
}
