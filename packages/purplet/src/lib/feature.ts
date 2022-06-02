import type * as DJS from 'discord.js';
import type { Awaitable, Dict } from '@davecode/types';
import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import type { PurpletInteraction } from './structures/interaction';
import type { Cleanup } from '../utils/types';

const IS_FEATURE = Symbol.for('purplet.is-bot-feature');

/** Lifecycle hooks run once, and can provide a cleanup function. */
export type LifecycleHook<E> = (this: Feature, event: E) => Awaitable<Cleanup>;
/** Event hooks run multiple times, and are passed an event object, they can also return stuff. */
export type EventHook<E, R = void> = (this: Feature, ctx: E) => Awaitable<R>;
/** Data hooks can be either functions that resolve to data, or just data themselves. */
export type DataHook<T> = ((this: Feature) => Awaitable<T>) | Awaitable<T>;

export type DJSOptions = Omit<DJS.ClientOptions, 'intents'>;
export type ApplicationCommandData = RESTPostAPIApplicationCommandsJSONBody;

export type IntentResolvable = number | number[];

/**
 * A feature represents anything that contributes to the bot's functionality. In purplet, features
 * achieve action through a small set of hooks that let you tie into DJS.js and Purplet's own API.
 * They look very similar to vite and rollup plugins.
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
   * Called on load with a DJS.js client. Specifying this hook will cause the DJS.js client to be
   * setup. This hook allows for a cleanup function, which you should use to remove event handlers.
   */
  djsClient?: LifecycleHook<DJS.Client>;
  /**
   * Called before the DJS.js client is created, passing a configuration object. You are able to
   * return or modify the configuration object, and that will be passed to DJS.js. Do not configure
   * gateway intents with this hook, and use the separate gateway intents hook instead.
   *
   * Note: this hook will only be called if some feature in your project requests the DJS.js client.
   */
  djsOptions?: EventHook<DJSOptions, DJSOptions | void>;
  /**
   * Called for incoming interactions, and does not explicity rely on DJS.js, meaning bots using
   * this hook can theoretically be deployed to a cloud function and called over HTTPs.
   */
  interaction?: EventHook<PurpletInteraction, DJS.APIInteractionResponse | void>;
  /**
   * An object mapping gateway event types to functions to handle them, does not explicity rely on
   * DJS.js, meaning bots using this hook instead of `djsClient` can theoretically run without
   * needing to use DJS.js. `INTERACTION_CREATE` is not emitted, as you should be using the
   * `interaction` hook for that.
   *
   * Specifying this hook will cause a gateway client to be setup, currently that is DJS.js.
   */
  gatewayEvent?: GatewayEventHook;
  /**
   * Called to resolve this feature's application commands. Return an array of commands to be
   * registered to DJS. If your command is not returned here, it may be deleted.
   *
   * In development mode, you must set the `UNSTABLE_PURPLET_COMMAND_GUILDS` environment variable to
   * a comma separated list of guild IDs to register commands to. Commands may also cleared on bot shutdown.
   *
   * Currently, only global application commands are supported. You can manually use the REST API to
   * add guild-level ones, but this will interfere with development mode's behavior of overwriting commands.
   */
  applicationCommands?: DataHook<ApplicationCommandData[]>;
  /**
   * This hook allows you to specify what gateway intents your gateway bot requires. Does not assume
   * a DJS.js environment, and will trigger on either using DJS.js, or the `gatewayEvents` hook.
   */
  intents?: DataHook<IntentResolvable>;
}

/** Represents feature data that has gone through `createFeature` but not annotated by `moduleToFeatureArray`. */
export type MarkedFeature<T = Record<never, unknown>> = {
  [IS_FEATURE]: true;
} & T;

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
export function createFeature<T extends Dict<unknown>>(
  data: FeatureData,
  staticProps?: T
): MarkedFeature<T> {
  return {
    [IS_FEATURE]: true,
    ...data,
    ...staticProps,
  } as unknown as MarkedFeature<T>;
}

/**
 * Returns true if a value is a `Feature` (this doesn't check annotation state, but it's type
 * returned will be `Feature` regardless). The subtle cast is in place, since most of the time, the
 * feature has already been annotated.
 */
export function isFeature(feature: unknown): feature is Feature {
  return ((feature && (feature as Feature)[IS_FEATURE]) || false) as boolean;
}

// big type to be placed at the end of the file

export interface GatewayEventHook {
  // This first type is missing... I don't mean to exclude it, but tsc will yell
  // APPLICATION_COMMAND_PERMISSIONS_UPDATE?: EventHook<DJS.GatewayApplicationCommandPermissionsUpdateDispatchData>;
  CHANNEL_CREATE?: EventHook<DJS.GatewayChannelCreateDispatchData>;
  CHANNEL_DELETE?: EventHook<DJS.GatewayChannelDeleteDispatchData>;
  CHANNEL_PINS_UPDATE?: EventHook<DJS.GatewayChannelPinsUpdateDispatchData>;
  CHANNEL_UPDATE?: EventHook<DJS.GatewayChannelUpdateDispatchData>;
  GUILD_BAN_ADD?: EventHook<DJS.GatewayGuildBanAddDispatchData>;
  GUILD_BAN_REMOVE?: EventHook<DJS.GatewayGuildBanRemoveDispatchData>;
  GUILD_CREATE?: EventHook<DJS.GatewayGuildCreateDispatchData>;
  GUILD_DELETE?: EventHook<DJS.GatewayGuildDeleteDispatchData>;
  GUILD_EMOJIS_UPDATE?: EventHook<DJS.GatewayGuildEmojisUpdateDispatchData>;
  GUILD_INTEGRATIONS_UPDATE?: EventHook<DJS.GatewayGuildIntegrationsUpdateDispatchData>;
  GUILD_MEMBER_ADD?: EventHook<DJS.GatewayGuildMemberAddDispatchData>;
  GUILD_MEMBER_REMOVE?: EventHook<DJS.GatewayGuildMemberRemoveDispatchData>;
  GUILD_MEMBERS_CHUNK?: EventHook<DJS.GatewayGuildMembersChunkDispatchData>;
  GUILD_MEMBER_UPDATE?: EventHook<DJS.GatewayGuildMemberUpdateDispatchData>;
  GUILD_ROLE_CREATE?: EventHook<DJS.GatewayGuildRoleCreateDispatchData>;
  GUILD_ROLE_DELETE?: EventHook<DJS.GatewayGuildRoleDeleteDispatchData>;
  GUILD_ROLE_UPDATE?: EventHook<DJS.GatewayGuildRoleUpdateDispatchData>;
  GUILD_STICKERS_UPDATE?: EventHook<DJS.GatewayGuildStickersUpdateDispatchData>;
  GUILD_UPDATE?: EventHook<DJS.GatewayGuildUpdateDispatchData>;
  INTEGRATION_CREATE?: EventHook<DJS.GatewayIntegrationCreateDispatchData>;
  INTEGRATION_DELETE?: EventHook<DJS.GatewayIntegrationDeleteDispatchData>;
  INTEGRATION_UPDATE?: EventHook<DJS.GatewayIntegrationUpdateDispatchData>;
  INVITE_CREATE?: EventHook<DJS.GatewayInviteCreateDispatchData>;
  INVITE_DELETE?: EventHook<DJS.GatewayInviteDeleteDispatchData>;
  MESSAGE_CREATE?: EventHook<DJS.GatewayMessageCreateDispatchData>;
  MESSAGE_DELETE?: EventHook<DJS.GatewayMessageDeleteDispatchData>;
  MESSAGE_DELETE_BULK?: EventHook<DJS.GatewayMessageDeleteBulkDispatchData>;
  MESSAGE_REACTION_ADD?: EventHook<DJS.GatewayMessageReactionAddDispatchData>;
  MESSAGE_REACTION_REMOVE?: EventHook<DJS.GatewayMessageReactionRemoveDispatchData>;
  MESSAGE_REACTION_REMOVE_ALL?: EventHook<DJS.GatewayMessageReactionRemoveAllDispatchData>;
  MESSAGE_REACTION_REMOVE_EMOJI?: EventHook<DJS.GatewayMessageReactionRemoveEmojiDispatchData>;
  MESSAGE_UPDATE?: EventHook<DJS.GatewayMessageUpdateDispatchData>;
  PRESENCE_UPDATE?: EventHook<DJS.GatewayPresenceUpdateDispatchData>;
  STAGE_INSTANCE_CREATE?: EventHook<DJS.GatewayStageInstanceCreateDispatchData>;
  STAGE_INSTANCE_DELETE?: EventHook<DJS.GatewayStageInstanceDeleteDispatchData>;
  STAGE_INSTANCE_UPDATE?: EventHook<DJS.GatewayStageInstanceUpdateDispatchData>;
  THREAD_CREATE?: EventHook<DJS.GatewayThreadCreateDispatchData>;
  THREAD_DELETE?: EventHook<DJS.GatewayThreadDeleteDispatchData>;
  THREAD_LIST_SYNC?: EventHook<DJS.GatewayThreadListSyncDispatchData>;
  THREAD_MEMBERS_UPDATE?: EventHook<DJS.GatewayThreadMembersUpdateDispatchData>;
  THREAD_MEMBER_UPDATE?: EventHook<DJS.GatewayThreadMemberUpdateDispatchData>;
  THREAD_UPDATE?: EventHook<DJS.GatewayThreadUpdateDispatchData>;
  TYPING_START?: EventHook<DJS.GatewayTypingStartDispatchData>;
  USER_UPDATE?: EventHook<DJS.GatewayUserUpdateDispatchData>;
  VOICE_SERVER_UPDATE?: EventHook<DJS.GatewayVoiceServerUpdateDispatchData>;
  VOICE_STATE_UPDATE?: EventHook<DJS.GatewayVoiceStateUpdateDispatchData>;
  WEBHOOKS_UPDATE?: EventHook<DJS.GatewayWebhooksUpdateDispatchData>;
  GUILD_SCHEDULED_EVENT_CREATE?: EventHook<DJS.GatewayGuildScheduledEventCreateDispatchData>;
  GUILD_SCHEDULED_EVENT_UPDATE?: EventHook<DJS.GatewayGuildScheduledEventUpdateDispatchData>;
  GUILD_SCHEDULED_EVENT_DELETE?: EventHook<DJS.GatewayGuildScheduledEventDeleteDispatchData>;
  GUILD_SCHEDULED_EVENT_USER_ADD?: EventHook<DJS.GatewayGuildScheduledEventUserAddDispatchData>;
  GUILD_SCHEDULED_EVENT_USER_REMOVE?: EventHook<DJS.GatewayGuildScheduledEventUserRemoveDispatchData>;
}
