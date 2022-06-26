import type * as Discord from 'discord-api-types/v10';
import type { Awaitable, Dict } from '@davecode/types';
import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import type { Interaction } from '../structures';
import type { Cleanup } from '../utils/types';

const IS_FEATURE = Symbol.for('purplet.is-bot-feature');

/** Lifecycle hooks run once, and can provide a cleanup function. */
export type LifecycleHook<E> = (this: Feature, event: E) => Awaitable<Cleanup>;
/** Event hooks run multiple times, and are passed an event object, they can also return stuff. */
export type EventHook<E, R = void> = (this: Feature, ctx: E) => Awaitable<R>;
/** Data hooks can be either functions that resolve to data, or just data themselves. */
export type DataHook<T> = ((this: Feature) => Awaitable<T>) | Awaitable<T>;

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
  /**
   * This is the first hook that is called for your bot, and is always called. This hook allows for
   * a cleanup function, which you should use to remove event handlers.
   */
  initialize?: LifecycleHook<void>;
  /**
   * Called for incoming interactions, which are used with the INTERACTION_CREATE event, but also
   * bundled into HTTP bots.
   */
  interaction?: EventHook<Interaction, void>;
  /**
   * An object mapping gateway event types to functions to handle them, does not explicity rely on
   * Discord.js, meaning bots using this hook instead of `djsClient` can theoretically run without
   * needing to use Discord.js. `INTERACTION_CREATE` is not emitted, as you should be using the
   * `interaction` hook for that.
   *
   * Specifying this hook will cause a gateway client to be setup, currently that is Discord.js.
   */
  gatewayEvent?: GatewayEventHook;
  /**
   * Called to resolve this feature's application commands. Return an array of commands to be
   * registered to Discord. In development, these are deployed per-guild, and in production they
   * must be managed with the `purplet deploy` CLI.
   *
   * Only global application commands are supported through this API. You can manually use the REST
   * API to add guild-level ones, but this will interfere with development mode's behavior of
   * overwriting commands.
   *
   * Currently, this hook does some extra processing to allow for space-separated subcommands, but
   * that will be removed in the future.
   */
  applicationCommands?: DataHook<ApplicationCommandData[]>;
  /** This hook allows you to specify what gateway intents your gateway bot requires. */
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
export type LifecycleHookNames = 'initialize';

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
  // APPLICATION_COMMAND_PERMISSIONS_UPDATE?: EventHook<Discord.GatewayApplicationCommandPermissionsUpdateDispatchData>;
  CHANNEL_CREATE?: EventHook<Discord.GatewayChannelCreateDispatchData>;
  CHANNEL_DELETE?: EventHook<Discord.GatewayChannelDeleteDispatchData>;
  CHANNEL_PINS_UPDATE?: EventHook<Discord.GatewayChannelPinsUpdateDispatchData>;
  CHANNEL_UPDATE?: EventHook<Discord.GatewayChannelUpdateDispatchData>;
  GUILD_BAN_ADD?: EventHook<Discord.GatewayGuildBanAddDispatchData>;
  GUILD_BAN_REMOVE?: EventHook<Discord.GatewayGuildBanRemoveDispatchData>;
  GUILD_CREATE?: EventHook<Discord.GatewayGuildCreateDispatchData>;
  GUILD_DELETE?: EventHook<Discord.GatewayGuildDeleteDispatchData>;
  GUILD_EMOJIS_UPDATE?: EventHook<Discord.GatewayGuildEmojisUpdateDispatchData>;
  GUILD_INTEGRATIONS_UPDATE?: EventHook<Discord.GatewayGuildIntegrationsUpdateDispatchData>;
  GUILD_MEMBER_ADD?: EventHook<Discord.GatewayGuildMemberAddDispatchData>;
  GUILD_MEMBER_REMOVE?: EventHook<Discord.GatewayGuildMemberRemoveDispatchData>;
  GUILD_MEMBERS_CHUNK?: EventHook<Discord.GatewayGuildMembersChunkDispatchData>;
  GUILD_MEMBER_UPDATE?: EventHook<Discord.GatewayGuildMemberUpdateDispatchData>;
  GUILD_ROLE_CREATE?: EventHook<Discord.GatewayGuildRoleCreateDispatchData>;
  GUILD_ROLE_DELETE?: EventHook<Discord.GatewayGuildRoleDeleteDispatchData>;
  GUILD_ROLE_UPDATE?: EventHook<Discord.GatewayGuildRoleUpdateDispatchData>;
  GUILD_STICKERS_UPDATE?: EventHook<Discord.GatewayGuildStickersUpdateDispatchData>;
  GUILD_UPDATE?: EventHook<Discord.GatewayGuildUpdateDispatchData>;
  INTEGRATION_CREATE?: EventHook<Discord.GatewayIntegrationCreateDispatchData>;
  INTEGRATION_DELETE?: EventHook<Discord.GatewayIntegrationDeleteDispatchData>;
  INTEGRATION_UPDATE?: EventHook<Discord.GatewayIntegrationUpdateDispatchData>;
  INVITE_CREATE?: EventHook<Discord.GatewayInviteCreateDispatchData>;
  INVITE_DELETE?: EventHook<Discord.GatewayInviteDeleteDispatchData>;
  MESSAGE_CREATE?: EventHook<Discord.GatewayMessageCreateDispatchData>;
  MESSAGE_DELETE?: EventHook<Discord.GatewayMessageDeleteDispatchData>;
  MESSAGE_DELETE_BULK?: EventHook<Discord.GatewayMessageDeleteBulkDispatchData>;
  MESSAGE_REACTION_ADD?: EventHook<Discord.GatewayMessageReactionAddDispatchData>;
  MESSAGE_REACTION_REMOVE?: EventHook<Discord.GatewayMessageReactionRemoveDispatchData>;
  MESSAGE_REACTION_REMOVE_ALL?: EventHook<Discord.GatewayMessageReactionRemoveAllDispatchData>;
  MESSAGE_REACTION_REMOVE_EMOJI?: EventHook<Discord.GatewayMessageReactionRemoveEmojiDispatchData>;
  MESSAGE_UPDATE?: EventHook<Discord.GatewayMessageUpdateDispatchData>;
  PRESENCE_UPDATE?: EventHook<Discord.GatewayPresenceUpdateDispatchData>;
  STAGE_INSTANCE_CREATE?: EventHook<Discord.GatewayStageInstanceCreateDispatchData>;
  STAGE_INSTANCE_DELETE?: EventHook<Discord.GatewayStageInstanceDeleteDispatchData>;
  STAGE_INSTANCE_UPDATE?: EventHook<Discord.GatewayStageInstanceUpdateDispatchData>;
  THREAD_CREATE?: EventHook<Discord.GatewayThreadCreateDispatchData>;
  THREAD_DELETE?: EventHook<Discord.GatewayThreadDeleteDispatchData>;
  THREAD_LIST_SYNC?: EventHook<Discord.GatewayThreadListSyncDispatchData>;
  THREAD_MEMBERS_UPDATE?: EventHook<Discord.GatewayThreadMembersUpdateDispatchData>;
  THREAD_MEMBER_UPDATE?: EventHook<Discord.GatewayThreadMemberUpdateDispatchData>;
  THREAD_UPDATE?: EventHook<Discord.GatewayThreadUpdateDispatchData>;
  TYPING_START?: EventHook<Discord.GatewayTypingStartDispatchData>;
  USER_UPDATE?: EventHook<Discord.GatewayUserUpdateDispatchData>;
  VOICE_SERVER_UPDATE?: EventHook<Discord.GatewayVoiceServerUpdateDispatchData>;
  VOICE_STATE_UPDATE?: EventHook<Discord.GatewayVoiceStateUpdateDispatchData>;
  WEBHOOKS_UPDATE?: EventHook<Discord.GatewayWebhooksUpdateDispatchData>;
  GUILD_SCHEDULED_EVENT_CREATE?: EventHook<Discord.GatewayGuildScheduledEventCreateDispatchData>;
  GUILD_SCHEDULED_EVENT_UPDATE?: EventHook<Discord.GatewayGuildScheduledEventUpdateDispatchData>;
  GUILD_SCHEDULED_EVENT_DELETE?: EventHook<Discord.GatewayGuildScheduledEventDeleteDispatchData>;
  GUILD_SCHEDULED_EVENT_USER_ADD?: EventHook<Discord.GatewayGuildScheduledEventUserAddDispatchData>;
  GUILD_SCHEDULED_EVENT_USER_REMOVE?: EventHook<Discord.GatewayGuildScheduledEventUserRemoveDispatchData>;
}
