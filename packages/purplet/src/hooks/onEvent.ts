import type * as Discord from 'discord-api-types/v10';
import { GatewayDispatchEvents, GatewayIntentBits } from 'discord-api-types/v10';
import { $dispatch, $intents, IntentsHookData } from '../lib/hook-core';
import { $merge } from '../lib/hook-merge';

function getIntents(ev: GatewayDispatchEvents): IntentsHookData {
  if (ev === GatewayDispatchEvents.GuildIntegrationsUpdate)
    return [GatewayIntentBits.GuildIntegrations];
  if (ev === GatewayDispatchEvents.WebhooksUpdate) return [GatewayIntentBits.GuildWebhooks];
  if (ev.startsWith('INVITE_')) return [GatewayIntentBits.GuildInvites];
  if (ev.startsWith('MESSAGE_REACTION_')) return [GatewayIntentBits.GuildMessageReactions];
  if (ev === GatewayDispatchEvents.TypingStart) return [GatewayIntentBits.GuildMessageTyping];
  if (
    [
      GatewayDispatchEvents.MessageCreate,
      GatewayDispatchEvents.MessageDelete,
      GatewayDispatchEvents.MessageDeleteBulk,
    ].includes(ev)
  )
    return [GatewayIntentBits.GuildMessages];
  if (ev.startsWith('GUILD_MEMBER')) return [GatewayIntentBits.GuildMembers];
  if (ev.startsWith('CHANNEL_')) return [GatewayIntentBits.Guilds];
  if (ev === GatewayDispatchEvents.GuildEmojisUpdate)
    return [GatewayIntentBits.GuildEmojisAndStickers];
  if (ev === GatewayDispatchEvents.GuildStickersUpdate)
    return [GatewayIntentBits.GuildEmojisAndStickers];
  if (ev.startsWith('GUILD_')) return [GatewayIntentBits.Guilds];
  return [];
}

export function $onEvent<K extends keyof GatewayEventData>(
  eventName: K,
  handler: (data: GatewayEventData[K]) => void
) {
  return $merge([
    $dispatch(event => {
      if (event.t === eventName) {
        handler(event.d as GatewayEventData[K]);
      }
    }),
    $intents(getIntents(eventName as GatewayDispatchEvents)),
  ]);
}

export interface GatewayEventData {
  // TODO: APPLICATION_COMMAND_PERMISSIONS_UPDATE does not have a proper structure yet.
  APPLICATION_COMMAND_PERMISSIONS_UPDATE: Discord.APIGuildApplicationCommandPermissions[];
  CHANNEL_CREATE: Discord.GatewayChannelCreateDispatchData;
  CHANNEL_DELETE: Discord.GatewayChannelDeleteDispatchData;
  CHANNEL_PINS_UPDATE: Discord.GatewayChannelPinsUpdateDispatchData;
  CHANNEL_UPDATE: Discord.GatewayChannelUpdateDispatchData;
  GUILD_BAN_ADD: Discord.GatewayGuildBanAddDispatchData;
  GUILD_BAN_REMOVE: Discord.GatewayGuildBanRemoveDispatchData;
  GUILD_CREATE: Discord.GatewayGuildCreateDispatchData;
  GUILD_DELETE: Discord.GatewayGuildDeleteDispatchData;
  GUILD_EMOJIS_UPDATE: Discord.GatewayGuildEmojisUpdateDispatchData;
  GUILD_INTEGRATIONS_UPDATE: Discord.GatewayGuildIntegrationsUpdateDispatchData;
  GUILD_MEMBER_ADD: Discord.GatewayGuildMemberAddDispatchData;
  GUILD_MEMBER_REMOVE: Discord.GatewayGuildMemberRemoveDispatchData;
  GUILD_MEMBERS_CHUNK: Discord.GatewayGuildMembersChunkDispatchData;
  GUILD_MEMBER_UPDATE: Discord.GatewayGuildMemberUpdateDispatchData;
  GUILD_ROLE_CREATE: Discord.GatewayGuildRoleCreateDispatchData;
  GUILD_ROLE_DELETE: Discord.GatewayGuildRoleDeleteDispatchData;
  GUILD_ROLE_UPDATE: Discord.GatewayGuildRoleUpdateDispatchData;
  GUILD_STICKERS_UPDATE: Discord.GatewayGuildStickersUpdateDispatchData;
  GUILD_UPDATE: Discord.GatewayGuildUpdateDispatchData;
  INTEGRATION_CREATE: Discord.GatewayIntegrationCreateDispatchData;
  INTEGRATION_DELETE: Discord.GatewayIntegrationDeleteDispatchData;
  INTEGRATION_UPDATE: Discord.GatewayIntegrationUpdateDispatchData;
  INVITE_CREATE: Discord.GatewayInviteCreateDispatchData;
  INVITE_DELETE: Discord.GatewayInviteDeleteDispatchData;
  MESSAGE_CREATE: Discord.GatewayMessageCreateDispatchData;
  MESSAGE_DELETE: Discord.GatewayMessageDeleteDispatchData;
  MESSAGE_DELETE_BULK: Discord.GatewayMessageDeleteBulkDispatchData;
  MESSAGE_REACTION_ADD: Discord.GatewayMessageReactionAddDispatchData;
  MESSAGE_REACTION_REMOVE: Discord.GatewayMessageReactionRemoveDispatchData;
  MESSAGE_REACTION_REMOVE_ALL: Discord.GatewayMessageReactionRemoveAllDispatchData;
  MESSAGE_REACTION_REMOVE_EMOJI: Discord.GatewayMessageReactionRemoveEmojiDispatchData;
  MESSAGE_UPDATE: Discord.GatewayMessageUpdateDispatchData;
  PRESENCE_UPDATE: Discord.GatewayPresenceUpdateDispatchData;
  STAGE_INSTANCE_CREATE: Discord.GatewayStageInstanceCreateDispatchData;
  STAGE_INSTANCE_DELETE: Discord.GatewayStageInstanceDeleteDispatchData;
  STAGE_INSTANCE_UPDATE: Discord.GatewayStageInstanceUpdateDispatchData;
  THREAD_CREATE: Discord.GatewayThreadCreateDispatchData;
  THREAD_DELETE: Discord.GatewayThreadDeleteDispatchData;
  THREAD_LIST_SYNC: Discord.GatewayThreadListSyncDispatchData;
  THREAD_MEMBERS_UPDATE: Discord.GatewayThreadMembersUpdateDispatchData;
  THREAD_MEMBER_UPDATE: Discord.GatewayThreadMemberUpdateDispatchData;
  THREAD_UPDATE: Discord.GatewayThreadUpdateDispatchData;
  TYPING_START: Discord.GatewayTypingStartDispatchData;
  USER_UPDATE: Discord.GatewayUserUpdateDispatchData;
  VOICE_SERVER_UPDATE: Discord.GatewayVoiceServerUpdateDispatchData;
  VOICE_STATE_UPDATE: Discord.GatewayVoiceStateUpdateDispatchData;
  WEBHOOKS_UPDATE: Discord.GatewayWebhooksUpdateDispatchData;
  GUILD_SCHEDULED_EVENT_CREATE: Discord.GatewayGuildScheduledEventCreateDispatchData;
  GUILD_SCHEDULED_EVENT_UPDATE: Discord.GatewayGuildScheduledEventUpdateDispatchData;
  GUILD_SCHEDULED_EVENT_DELETE: Discord.GatewayGuildScheduledEventDeleteDispatchData;
  GUILD_SCHEDULED_EVENT_USER_ADD: Discord.GatewayGuildScheduledEventUserAddDispatchData;
  GUILD_SCHEDULED_EVENT_USER_REMOVE: Discord.GatewayGuildScheduledEventUserRemoveDispatchData;
}
