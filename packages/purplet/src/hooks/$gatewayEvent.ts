import type * as Discord from 'purplet/types';
import { GatewayIntentBits } from 'purplet/types';
import { $dispatch, $intents } from '../lib/hook-core';
import { $merge } from '../lib/hook-merge';

/**
 * Mapping of event names to their respective intent bits, in this format [normal, dm] If `dm` is
 * present, then the `dm` property of the options object will enable the dm intent instead of the normal one.
 */
const intentRequirements: Record<string, [normal: GatewayIntentBits, dm?: GatewayIntentBits]> = {
  GUILD_CREATE: [GatewayIntentBits.Guilds],
  GUILD_UPDATE: [GatewayIntentBits.Guilds],
  GUILD_DELETE: [GatewayIntentBits.Guilds],
  GUILD_ROLE_CREATE: [GatewayIntentBits.Guilds],
  GUILD_ROLE_UPDATE: [GatewayIntentBits.Guilds],
  GUILD_ROLE_DELETE: [GatewayIntentBits.Guilds],
  CHANNEL_CREATE: [GatewayIntentBits.Guilds],
  CHANNEL_UPDATE: [GatewayIntentBits.Guilds],
  CHANNEL_DELETE: [GatewayIntentBits.Guilds],
  CHANNEL_PINS_UPDATE: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
  THREAD_CREATE: [GatewayIntentBits.Guilds],
  THREAD_UPDATE: [GatewayIntentBits.Guilds],
  THREAD_DELETE: [GatewayIntentBits.Guilds],
  THREAD_LIST_SYNC: [GatewayIntentBits.Guilds],
  THREAD_MEMBER_UPDATE: [GatewayIntentBits.Guilds],
  THREAD_MEMBERS_UPDATE: [GatewayIntentBits.GuildMembers],
  STAGE_INSTANCE_CREATE: [GatewayIntentBits.Guilds],
  STAGE_INSTANCE_UPDATE: [GatewayIntentBits.Guilds],
  STAGE_INSTANCE_DELETE: [GatewayIntentBits.Guilds],
  GUILD_MEMBER_ADD: [GatewayIntentBits.GuildMembers],
  GUILD_MEMBER_UPDATE: [GatewayIntentBits.GuildMembers],
  GUILD_MEMBER_REMOVE: [GatewayIntentBits.GuildMembers],
  GUILD_BAN_ADD: [GatewayIntentBits.GuildBans],
  GUILD_BAN_REMOVE: [GatewayIntentBits.GuildBans],
  GUILD_EMOJIS_UPDATE: [GatewayIntentBits.GuildEmojisAndStickers],
  GUILD_STICKERS_UPDATE: [GatewayIntentBits.GuildEmojisAndStickers],
  GUILD_INTEGRATIONS_UPDATE: [GatewayIntentBits.GuildIntegrations],
  INTEGRATION_CREATE: [GatewayIntentBits.GuildIntegrations],
  INTEGRATION_UPDATE: [GatewayIntentBits.GuildIntegrations],
  INTEGRATION_DELETE: [GatewayIntentBits.GuildIntegrations],
  WEBHOOKS_UPDATE: [GatewayIntentBits.GuildWebhooks],
  INVITE_CREATE: [GatewayIntentBits.GuildInvites],
  INVITE_DELETE: [GatewayIntentBits.GuildInvites],
  VOICE_STATE_UPDATE: [GatewayIntentBits.GuildVoiceStates],
  PRESENCE_UPDATE: [GatewayIntentBits.GuildPresences],
  MESSAGE_CREATE: [GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
  MESSAGE_UPDATE: [GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
  MESSAGE_DELETE: [GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
  MESSAGE_DELETE_BULK: [GatewayIntentBits.GuildMessages],
  MESSAGE_REACTION_ADD: [
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
  ],
  MESSAGE_REACTION_REMOVE: [
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
  ],
  MESSAGE_REACTION_REMOVE_ALL: [
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
  ],
  MESSAGE_REACTION_REMOVE_EMOJI: [
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
  ],
  TYPING_START: [GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessageTyping],
  GUILD_SCHEDULED_EVENT_CREATE: [GatewayIntentBits.GuildScheduledEvents],
  GUILD_SCHEDULED_EVENT_UPDATE: [GatewayIntentBits.GuildScheduledEvents],
  GUILD_SCHEDULED_EVENT_DELETE: [GatewayIntentBits.GuildScheduledEvents],
  GUILD_SCHEDULED_EVENT_USER_ADD: [GatewayIntentBits.GuildScheduledEvents],
  GUILD_SCHEDULED_EVENT_USER_REMOVE: [GatewayIntentBits.GuildScheduledEvents],
  // TODO: Waiting on discord-api-types
  // AUTO_MODERATION_RULE_CREATE: [GatewayIntentBits.AutoModerationConfiguration],
  // AUTO_MODERATION_RULE_UPDATE: [GatewayIntentBits.AutoModerationConfiguration],
  // AUTO_MODERATION_RULE_DELETE: [GatewayIntentBits.AutoModerationConfiguration],
  // AUTO_MODERATION_ACTION_EXECUTION: [GatewayIntentBits.AutoModerationExecution],
};

export interface GatewayEventHookData {
  /** If set to true, intents will not be specified, meaning you may not recieve any events. */
  noIntents?: boolean;
  /**
   * If set to true, the intent for DMs is enabled in addition to the guild version. If set to
   * 'only', only the dm intent will be added. This does NOT affect what events are passed to the
   * callback if another $gatewayEvent hook is used that provides intents.
   */
  dm?: boolean | 'only';
}

export function $gatewayEvent<K extends keyof GatewayEventData>(
  eventName: K,
  handler: (data: GatewayEventData[K]) => void,
  options: GatewayEventHookData = {}
) {
  const [intents, dmIntents = 0] = intentRequirements[eventName];

  const intentsToUse = options.noIntents
    ? 0
    : options.dm === 'only'
    ? dmIntents
    : options.dm
    ? intents | dmIntents
    : intents;

  return $merge([
    $dispatch(event => {
      if (event.t === eventName) {
        handler(event.d as GatewayEventData[K]);
      }
    }),
    intentsToUse && $intents(intentsToUse),
  ]);
}

/**
 * Mapping gateway event names to their respective data. Excludes READY as it is impossible to
 * listen to with $gatewayEvent.
 */
export interface GatewayEventData {
  // TODO: APPLICATION_COMMAND_PERMISSIONS_UPDATE does not have a proper structure yet.
  APPLICATION_COMMAND_PERMISSIONS_UPDATE: Discord.APIGuildApplicationCommandPermissions[];
  // AUTO_MODERATION_RULE_CREATE: Discord.GatewayAutoModerationRuleCreateDispatchData;
  // AUTO_MODERATION_RULE_UPDATE: Discord.GatewayAutoModerationRuleUpdateDispatchData;
  // AUTO_MODERATION_RULE_DELETE: Discord.GatewayAutoModerationRuleDeleteDispatchData;
  // AUTO_MODERATION_ACTION_EXECUTION: Discord.GatewayAutoModerationActionExecutionDispatchData;
  CHANNEL_CREATE: Discord.GatewayChannelCreateDispatchData;
  CHANNEL_UPDATE: Discord.GatewayChannelUpdateDispatchData;
  CHANNEL_DELETE: Discord.GatewayChannelDeleteDispatchData;
  CHANNEL_PINS_UPDATE: Discord.GatewayChannelPinsUpdateDispatchData;
  THREAD_CREATE: Discord.GatewayThreadCreateDispatchData;
  THREAD_UPDATE: Discord.GatewayThreadUpdateDispatchData;
  THREAD_DELETE: Discord.GatewayThreadDeleteDispatchData;
  THREAD_LIST_SYNC: Discord.GatewayThreadListSyncDispatchData;
  THREAD_MEMBER_UPDATE: Discord.GatewayThreadMemberUpdateDispatchData;
  THREAD_MEMBERS_UPDATE: Discord.GatewayThreadMembersUpdateDispatchData;
  GUILD_CREATE: Discord.GatewayGuildCreateDispatchData;
  GUILD_UPDATE: Discord.GatewayGuildUpdateDispatchData;
  GUILD_DELETE: Discord.GatewayGuildDeleteDispatchData;
  GUILD_BAN_ADD: Discord.GatewayGuildBanAddDispatchData;
  GUILD_BAN_REMOVE: Discord.GatewayGuildBanRemoveDispatchData;
  GUILD_EMOJIS_UPDATE: Discord.GatewayGuildEmojisUpdateDispatchData;
  GUILD_STICKERS_UPDATE: Discord.GatewayGuildStickersUpdateDispatchData;
  GUILD_INTEGRATIONS_UPDATE: Discord.GatewayGuildIntegrationsUpdateDispatchData;
  GUILD_MEMBER_ADD: Discord.GatewayGuildMemberAddDispatchData;
  GUILD_MEMBER_REMOVE: Discord.GatewayGuildMemberRemoveDispatchData;
  GUILD_MEMBER_UPDATE: Discord.GatewayGuildMemberUpdateDispatchData;
  GUILD_MEMBERS_CHUNK: Discord.GatewayGuildMembersChunkDispatchData;
  GUILD_ROLE_CREATE: Discord.GatewayGuildRoleCreateDispatchData;
  GUILD_ROLE_UPDATE: Discord.GatewayGuildRoleUpdateDispatchData;
  GUILD_ROLE_DELETE: Discord.GatewayGuildRoleDeleteDispatchData;
  GUILD_SCHEDULED_EVENT_CREATE: Discord.GatewayGuildScheduledEventCreateDispatchData;
  GUILD_SCHEDULED_EVENT_UPDATE: Discord.GatewayGuildScheduledEventUpdateDispatchData;
  GUILD_SCHEDULED_EVENT_DELETE: Discord.GatewayGuildScheduledEventDeleteDispatchData;
  GUILD_SCHEDULED_EVENT_USER_ADD: Discord.GatewayGuildScheduledEventUserAddDispatchData;
  GUILD_SCHEDULED_EVENT_USER_REMOVE: Discord.GatewayGuildScheduledEventUserRemoveDispatchData;
  INTEGRATION_CREATE: Discord.GatewayIntegrationCreateDispatchData;
  INTEGRATION_UPDATE: Discord.GatewayIntegrationUpdateDispatchData;
  INTEGRATION_DELETE: Discord.GatewayIntegrationDeleteDispatchData;
  INTERACTION_CREATE: Discord.GatewayInteractionCreateDispatchData;
  INVITE_CREATE: Discord.GatewayInviteCreateDispatchData;
  INVITE_DELETE: Discord.GatewayInviteDeleteDispatchData;
  MESSAGE_CREATE: Discord.GatewayMessageCreateDispatchData;
  MESSAGE_UPDATE: Discord.GatewayMessageUpdateDispatchData;
  MESSAGE_DELETE: Discord.GatewayMessageDeleteDispatchData;
  MESSAGE_DELETE_BULK: Discord.GatewayMessageDeleteBulkDispatchData;
  MESSAGE_REACTION_ADD: Discord.GatewayMessageReactionAddDispatchData;
  MESSAGE_REACTION_REMOVE: Discord.GatewayMessageReactionRemoveDispatchData;
  MESSAGE_REACTION_REMOVE_ALL: Discord.GatewayMessageReactionRemoveAllDispatchData;
  MESSAGE_REACTION_REMOVE_EMOJI: Discord.GatewayMessageReactionRemoveEmojiDispatchData;
  PRESENCE_UPDATE: Discord.GatewayPresenceUpdateDispatchData;
  STAGE_INSTANCE_CREATE: Discord.GatewayStageInstanceCreateDispatchData;
  STAGE_INSTANCE_DELETE: Discord.GatewayStageInstanceDeleteDispatchData;
  STAGE_INSTANCE_UPDATE: Discord.GatewayStageInstanceUpdateDispatchData;
  TYPING_START: Discord.GatewayTypingStartDispatchData;
  USER_UPDATE: Discord.GatewayUserUpdateDispatchData;
  VOICE_STATE_UPDATE: Discord.GatewayVoiceStateUpdateDispatchData;
  VOICE_SERVER_UPDATE: Discord.GatewayVoiceServerUpdateDispatchData;
}
