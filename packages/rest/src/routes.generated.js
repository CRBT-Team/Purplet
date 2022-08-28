// This file is generated by scripts/gen-routes.js
// Do not modify directly.
// @no-line-count

import { group } from './route-group';

export const ApplicationCommand = group({
  getGlobalApplicationCommands: {
    method: 'GET',
    route: (applicationId) => `/applications/${applicationId}/commands`,
    params: ["applicationId"],
  },
  createGlobalApplicationCommand: {
    method: 'POST',
    route: (applicationId) => `/applications/${applicationId}/commands`,
    params: ["applicationId"],
  },
  getGlobalApplicationCommand: {
    method: 'GET',
    route: (applicationId, commandId) => `/applications/${applicationId}/commands/${commandId}`,
    params: ["applicationId", "commandId"],
  },
  editGlobalApplicationCommand: {
    method: 'PATCH',
    route: (applicationId, commandId) => `/applications/${applicationId}/commands/${commandId}`,
    params: ["applicationId", "commandId"],
  },
  deleteGlobalApplicationCommand: {
    method: 'DELETE',
    route: (applicationId, commandId) => `/applications/${applicationId}/commands/${commandId}`,
    params: ["applicationId", "commandId"],
  },
  bulkOverwriteGlobalApplicationCommands: {
    method: 'PUT',
    route: (applicationId) => `/applications/${applicationId}/commands`,
    params: ["applicationId"],
  },
  getGuildApplicationCommands: {
    method: 'GET',
    route: (applicationId, guildId) => `/applications/${applicationId}/guilds/${guildId}/commands`,
    params: ["applicationId", "guildId"],
  },
  createGuildApplicationCommand: {
    method: 'POST',
    route: (applicationId, guildId) => `/applications/${applicationId}/guilds/${guildId}/commands`,
    params: ["applicationId", "guildId"],
  },
  getGuildApplicationCommand: {
    method: 'GET',
    route: (applicationId, guildId, commandId) => `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
    params: ["applicationId", "guildId", "commandId"],
  },
  editGuildApplicationCommand: {
    method: 'PATCH',
    route: (applicationId, guildId, commandId) => `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
    params: ["applicationId", "guildId", "commandId"],
  },
  deleteGuildApplicationCommand: {
    method: 'DELETE',
    route: (applicationId, guildId, commandId) => `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
    params: ["applicationId", "guildId", "commandId"],
  },
  bulkOverwriteGuildApplicationCommands: {
    method: 'PUT',
    route: (applicationId, guildId) => `/applications/${applicationId}/guilds/${guildId}/commands`,
    params: ["applicationId", "guildId"],
  },
  getGuildApplicationCommandPermissions: {
    method: 'GET',
    route: (applicationId, guildId) => `/applications/${applicationId}/guilds/${guildId}/commands/permissions`,
    params: ["applicationId", "guildId"],
  },
  getApplicationCommandPermissions: {
    method: 'GET',
    route: (applicationId, guildId, commandId) => `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`,
    params: ["applicationId", "guildId", "commandId"],
  },
  editApplicationCommandPermissions: {
    method: 'PUT',
    route: (applicationId, guildId, commandId) => `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`,
    params: ["applicationId", "guildId", "commandId"],
  },
  batchEditApplicationCommandPermissions: {
    method: 'PUT',
    route: (applicationId, guildId) => `/applications/${applicationId}/guilds/${guildId}/commands/permissions`,
    params: ["applicationId", "guildId"],
  },
});

export const AuditLog = group({
  getGuildAuditLog: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/audit-logs`,
    params: ["guildId"],
  },
});

export const AutoModeration = group({
  listAutoModerationRulesForGuild: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/auto-moderation/rules`,
    params: ["guildId"],
  },
  getAutoModerationRule: {
    method: 'GET',
    route: (guildId, autoModerationRuleId) => `/guilds/${guildId}/auto-moderation/rules/${autoModerationRuleId}`,
    params: ["guildId", "autoModerationRuleId"],
  },
  createAutoModerationRule: {
    method: 'POST',
    route: (guildId) => `/guilds/${guildId}/auto-moderation/rules`,
    params: ["guildId"],
  },
  modifyAutoModerationRule: {
    method: 'PATCH',
    route: (guildId, autoModerationRuleId) => `/guilds/${guildId}/auto-moderation/rules/${autoModerationRuleId}`,
    params: ["guildId", "autoModerationRuleId"],
  },
  deleteAutoModerationRule: {
    method: 'DELETE',
    route: (guildId, autoModerationRuleId) => `/guilds/${guildId}/auto-moderation/rules/${autoModerationRuleId}`,
    params: ["guildId", "autoModerationRuleId"],
  },
});

export const Channel = group({
  getChannel: {
    method: 'GET',
    route: (channelId) => `/channels/${channelId}`,
    params: ["channelId"],
  },
  modifyChannel: {
    method: 'PATCH',
    route: (channelId) => `/channels/${channelId}`,
    params: ["channelId"],
  },
  deleteOrCloseChannel: {
    method: 'DELETE',
    route: (channelId) => `/channels/${channelId}`,
    params: ["channelId"],
  },
  getChannelMessages: {
    method: 'GET',
    route: (channelId) => `/channels/${channelId}/messages`,
    params: ["channelId"],
  },
  getChannelMessage: {
    method: 'GET',
    route: (channelId, messageId) => `/channels/${channelId}/messages/${messageId}`,
    params: ["channelId", "messageId"],
  },
  createMessage: {
    method: 'POST',
    route: (channelId) => `/channels/${channelId}/messages`,
    params: ["channelId"],
  },
  crosspostMessage: {
    method: 'POST',
    route: (channelId, messageId) => `/channels/${channelId}/messages/${messageId}/crosspost`,
    params: ["channelId", "messageId"],
  },
  createReaction: {
    method: 'PUT',
    route: (channelId, messageId, emoji) => `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`,
    params: ["channelId", "messageId", "emoji"],
  },
  deleteOwnReaction: {
    method: 'DELETE',
    route: (channelId, messageId, emoji) => `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`,
    params: ["channelId", "messageId", "emoji"],
  },
  deleteUserReaction: {
    method: 'DELETE',
    route: (channelId, messageId, emoji, userId) => `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/${userId}`,
    params: ["channelId", "messageId", "emoji", "userId"],
  },
  getReactions: {
    method: 'GET',
    route: (channelId, messageId, emoji) => `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`,
    params: ["channelId", "messageId", "emoji"],
  },
  deleteAllReactions: {
    method: 'DELETE',
    route: (channelId, messageId) => `/channels/${channelId}/messages/${messageId}/reactions`,
    params: ["channelId", "messageId"],
  },
  deleteAllReactionsForEmoji: {
    method: 'DELETE',
    route: (channelId, messageId, emoji) => `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`,
    params: ["channelId", "messageId", "emoji"],
  },
  editMessage: {
    method: 'PATCH',
    route: (channelId, messageId) => `/channels/${channelId}/messages/${messageId}`,
    params: ["channelId", "messageId"],
  },
  deleteMessage: {
    method: 'DELETE',
    route: (channelId, messageId) => `/channels/${channelId}/messages/${messageId}`,
    params: ["channelId", "messageId"],
  },
  bulkDeleteMessages: {
    method: 'POST',
    route: (channelId) => `/channels/${channelId}/messages/bulk-delete`,
    params: ["channelId"],
  },
  editChannelPermissions: {
    method: 'PUT',
    route: (channelId, overwriteId) => `/channels/${channelId}/permissions/${overwriteId}`,
    params: ["channelId", "overwriteId"],
  },
  getChannelInvites: {
    method: 'GET',
    route: (channelId) => `/channels/${channelId}/invites`,
    params: ["channelId"],
  },
  createChannelInvite: {
    method: 'POST',
    route: (channelId) => `/channels/${channelId}/invites`,
    params: ["channelId"],
  },
  deleteChannelPermission: {
    method: 'DELETE',
    route: (channelId, overwriteId) => `/channels/${channelId}/permissions/${overwriteId}`,
    params: ["channelId", "overwriteId"],
  },
  followAnnouncementChannel: {
    method: 'POST',
    route: (channelId) => `/channels/${channelId}/followers`,
    params: ["channelId"],
  },
  triggerTypingIndicator: {
    method: 'POST',
    route: (channelId) => `/channels/${channelId}/typing`,
    params: ["channelId"],
  },
  getPinnedMessages: {
    method: 'GET',
    route: (channelId) => `/channels/${channelId}/pins`,
    params: ["channelId"],
  },
  pinMessage: {
    method: 'PUT',
    route: (channelId, messageId) => `/channels/${channelId}/pins/${messageId}`,
    params: ["channelId", "messageId"],
  },
  unpinMessage: {
    method: 'DELETE',
    route: (channelId, messageId) => `/channels/${channelId}/pins/${messageId}`,
    params: ["channelId", "messageId"],
  },
  groupDMAddRecipient: {
    method: 'PUT',
    route: (channelId, userId) => `/channels/${channelId}/recipients/${userId}`,
    params: ["channelId", "userId"],
  },
  groupDMRemoveRecipient: {
    method: 'DELETE',
    route: (channelId, userId) => `/channels/${channelId}/recipients/${userId}`,
    params: ["channelId", "userId"],
  },
  startThreadFromMessage: {
    method: 'POST',
    route: (channelId, messageId) => `/channels/${channelId}/messages/${messageId}/threads`,
    params: ["channelId", "messageId"],
  },
  startThreadWithoutMessage: {
    method: 'POST',
    route: (channelId) => `/channels/${channelId}/threads`,
    params: ["channelId"],
  },
  startThreadInForumChannel: {
    method: 'POST',
    route: (channelId) => `/channels/${channelId}/threads`,
    params: ["channelId"],
  },
  joinThread: {
    method: 'PUT',
    route: (channelId) => `/channels/${channelId}/thread-members/@me`,
    params: ["channelId"],
  },
  addThreadMember: {
    method: 'PUT',
    route: (channelId, userId) => `/channels/${channelId}/thread-members/${userId}`,
    params: ["channelId", "userId"],
  },
  leaveThread: {
    method: 'DELETE',
    route: (channelId) => `/channels/${channelId}/thread-members/@me`,
    params: ["channelId"],
  },
  removeThreadMember: {
    method: 'DELETE',
    route: (channelId, userId) => `/channels/${channelId}/thread-members/${userId}`,
    params: ["channelId", "userId"],
  },
  getThreadMember: {
    method: 'GET',
    route: (channelId, userId) => `/channels/${channelId}/thread-members/${userId}`,
    params: ["channelId", "userId"],
  },
  listThreadMembers: {
    method: 'GET',
    route: (channelId) => `/channels/${channelId}/thread-members`,
    params: ["channelId"],
  },
  listPublicArchivedThreads: {
    method: 'GET',
    route: (channelId) => `/channels/${channelId}/threads/archived/public`,
    params: ["channelId"],
  },
  listPrivateArchivedThreads: {
    method: 'GET',
    route: (channelId) => `/channels/${channelId}/threads/archived/private`,
    params: ["channelId"],
  },
  listJoinedPrivateArchivedThreads: {
    method: 'GET',
    route: (channelId) => `/channels/${channelId}/users/@me/threads/archived/private`,
    params: ["channelId"],
  },
});

export const Emoji = group({
  listGuildEmojis: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/emojis`,
    params: ["guildId"],
  },
  getGuildEmoji: {
    method: 'GET',
    route: (guildId, emojiId) => `/guilds/${guildId}/emojis/${emojiId}`,
    params: ["guildId", "emojiId"],
  },
  createGuildEmoji: {
    method: 'POST',
    route: (guildId) => `/guilds/${guildId}/emojis`,
    params: ["guildId"],
  },
  modifyGuildEmoji: {
    method: 'PATCH',
    route: (guildId, emojiId) => `/guilds/${guildId}/emojis/${emojiId}`,
    params: ["guildId", "emojiId"],
  },
  deleteGuildEmoji: {
    method: 'DELETE',
    route: (guildId, emojiId) => `/guilds/${guildId}/emojis/${emojiId}`,
    params: ["guildId", "emojiId"],
  },
});

export const Gateway = group({
  getGateway: {
    method: 'GET',
    route: "/gateway",
    auth: false,
  },
  getGatewayBot: {
    method: 'GET',
    route: "/gateway/bot",
  },
});

export const Guild = group({
  createGuild: {
    method: 'POST',
    route: "/guilds",
  },
  getGuild: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}`,
    params: ["guildId"],
  },
  getGuildPreview: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/preview`,
    params: ["guildId"],
  },
  modifyGuild: {
    method: 'PATCH',
    route: (guildId) => `/guilds/${guildId}`,
    params: ["guildId"],
  },
  deleteGuild: {
    method: 'DELETE',
    route: (guildId) => `/guilds/${guildId}`,
    params: ["guildId"],
  },
  getGuildChannels: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/channels`,
    params: ["guildId"],
  },
  createGuildChannel: {
    method: 'POST',
    route: (guildId) => `/guilds/${guildId}/channels`,
    params: ["guildId"],
  },
  modifyGuildChannelPositions: {
    method: 'PATCH',
    route: (guildId) => `/guilds/${guildId}/channels`,
    params: ["guildId"],
  },
  listActiveGuildThreads: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/threads/active`,
    params: ["guildId"],
  },
  getGuildMember: {
    method: 'GET',
    route: (guildId, userId) => `/guilds/${guildId}/members/${userId}`,
    params: ["guildId", "userId"],
  },
  listGuildMembers: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/members`,
    params: ["guildId"],
  },
  searchGuildMembers: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/members/search`,
    params: ["guildId"],
  },
  addGuildMember: {
    method: 'PUT',
    route: (guildId, userId) => `/guilds/${guildId}/members/${userId}`,
    params: ["guildId", "userId"],
  },
  modifyGuildMember: {
    method: 'PATCH',
    route: (guildId, userId) => `/guilds/${guildId}/members/${userId}`,
    params: ["guildId", "userId"],
  },
  modifyCurrentMember: {
    method: 'PATCH',
    route: (guildId) => `/guilds/${guildId}/members/@me`,
    params: ["guildId"],
  },
  modifyCurrentUserNick: {
    method: 'PATCH',
    route: (guildId) => `/guilds/${guildId}/members/@me/nick`,
    params: ["guildId"],
  },
  addGuildMemberRole: {
    method: 'PUT',
    route: (guildId, userId, roleId) => `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
    params: ["guildId", "userId", "roleId"],
  },
  removeGuildMemberRole: {
    method: 'DELETE',
    route: (guildId, userId, roleId) => `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
    params: ["guildId", "userId", "roleId"],
  },
  removeGuildMember: {
    method: 'DELETE',
    route: (guildId, userId) => `/guilds/${guildId}/members/${userId}`,
    params: ["guildId", "userId"],
  },
  getGuildBans: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/bans`,
    params: ["guildId"],
  },
  getGuildBan: {
    method: 'GET',
    route: (guildId, userId) => `/guilds/${guildId}/bans/${userId}`,
    params: ["guildId", "userId"],
  },
  createGuildBan: {
    method: 'PUT',
    route: (guildId, userId) => `/guilds/${guildId}/bans/${userId}`,
    params: ["guildId", "userId"],
  },
  removeGuildBan: {
    method: 'DELETE',
    route: (guildId, userId) => `/guilds/${guildId}/bans/${userId}`,
    params: ["guildId", "userId"],
  },
  getGuildRoles: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/roles`,
    params: ["guildId"],
  },
  createGuildRole: {
    method: 'POST',
    route: (guildId) => `/guilds/${guildId}/roles`,
    params: ["guildId"],
  },
  modifyGuildRolePositions: {
    method: 'PATCH',
    route: (guildId) => `/guilds/${guildId}/roles`,
    params: ["guildId"],
  },
  modifyGuildRole: {
    method: 'PATCH',
    route: (guildId, roleId) => `/guilds/${guildId}/roles/${roleId}`,
    params: ["guildId", "roleId"],
  },
  modifyGuildMFALevel: {
    method: 'POST',
    route: (guildId) => `/guilds/${guildId}/mfa`,
    params: ["guildId"],
  },
  deleteGuildRole: {
    method: 'DELETE',
    route: (guildId, roleId) => `/guilds/${guildId}/roles/${roleId}`,
    params: ["guildId", "roleId"],
  },
  getGuildPruneCount: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/prune`,
    params: ["guildId"],
  },
  beginGuildPrune: {
    method: 'POST',
    route: (guildId) => `/guilds/${guildId}/prune`,
    params: ["guildId"],
  },
  getGuildVoiceRegions: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/regions`,
    params: ["guildId"],
  },
  getGuildInvites: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/invites`,
    params: ["guildId"],
  },
  getGuildIntegrations: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/integrations`,
    params: ["guildId"],
  },
  deleteGuildIntegration: {
    method: 'DELETE',
    route: (guildId, integrationId) => `/guilds/${guildId}/integrations/${integrationId}`,
    params: ["guildId", "integrationId"],
  },
  getGuildWidgetSettings: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/widget`,
    params: ["guildId"],
  },
  modifyGuildWidget: {
    method: 'PATCH',
    route: (guildId) => `/guilds/${guildId}/widget`,
    params: ["guildId"],
  },
  getGuildWidget: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/widget.json`,
    params: ["guildId"],
  },
  getGuildVanityURL: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/vanity-url`,
    params: ["guildId"],
  },
  getGuildWidgetImage: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/widget.png`,
    params: ["guildId"],
  },
  getGuildWelcomeScreen: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/welcome-screen`,
    params: ["guildId"],
  },
  modifyGuildWelcomeScreen: {
    method: 'PATCH',
    route: (guildId) => `/guilds/${guildId}/welcome-screen`,
    params: ["guildId"],
  },
  modifyCurrentUserVoiceState: {
    method: 'PATCH',
    route: (guildId) => `/guilds/${guildId}/voice-states/@me`,
    params: ["guildId"],
  },
  modifyUserVoiceState: {
    method: 'PATCH',
    route: (guildId, userId) => `/guilds/${guildId}/voice-states/${userId}`,
    params: ["guildId", "userId"],
  },
});

export const GuildScheduledEvent = group({
  listScheduledEventsForGuild: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/scheduled-events`,
    params: ["guildId"],
  },
  createGuildScheduledEvent: {
    method: 'POST',
    route: (guildId) => `/guilds/${guildId}/scheduled-events`,
    params: ["guildId"],
  },
  getGuildScheduledEvent: {
    method: 'GET',
    route: (guildId, guildScheduledEventId) => `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}`,
    params: ["guildId", "guildScheduledEventId"],
  },
  modifyGuildScheduledEvent: {
    method: 'PATCH',
    route: (guildId, guildScheduledEventId) => `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}`,
    params: ["guildId", "guildScheduledEventId"],
  },
  deleteGuildScheduledEvent: {
    method: 'DELETE',
    route: (guildId, guildScheduledEventId) => `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}`,
    params: ["guildId", "guildScheduledEventId"],
  },
  getGuildScheduledEventUsers: {
    method: 'GET',
    route: (guildId, guildScheduledEventId) => `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}/users`,
    params: ["guildId", "guildScheduledEventId"],
  },
});

export const GuildTemplate = group({
  getGuildTemplate: {
    method: 'GET',
    route: (templateCode) => `/guilds/templates/${templateCode}`,
    params: ["templateCode"],
  },
  createGuildFromGuildTemplate: {
    method: 'POST',
    route: (templateCode) => `/guilds/templates/${templateCode}`,
    params: ["templateCode"],
  },
  getGuildTemplates: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/templates`,
    params: ["guildId"],
  },
  createGuildTemplate: {
    method: 'POST',
    route: (guildId) => `/guilds/${guildId}/templates`,
    params: ["guildId"],
  },
  syncGuildTemplate: {
    method: 'PUT',
    route: (guildId, templateCode) => `/guilds/${guildId}/templates/${templateCode}`,
    params: ["guildId", "templateCode"],
  },
  modifyGuildTemplate: {
    method: 'PATCH',
    route: (guildId, templateCode) => `/guilds/${guildId}/templates/${templateCode}`,
    params: ["guildId", "templateCode"],
  },
  deleteGuildTemplate: {
    method: 'DELETE',
    route: (guildId, templateCode) => `/guilds/${guildId}/templates/${templateCode}`,
    params: ["guildId", "templateCode"],
  },
});

export const InteractionResponse = group({
  createInteractionResponse: {
    method: 'POST',
    route: (interactionId, interactionToken) => `/interactions/${interactionId}/${interactionToken}/callback`,
    params: ["interactionId", "interactionToken"],
  },
  getOriginalInteractionResponse: {
    method: 'GET',
    route: (applicationId, interactionToken) => `/webhooks/${applicationId}/${interactionToken}/messages/@original`,
    params: ["applicationId", "interactionToken"],
  },
  editOriginalInteractionResponse: {
    method: 'PATCH',
    route: (applicationId, interactionToken) => `/webhooks/${applicationId}/${interactionToken}/messages/@original`,
    params: ["applicationId", "interactionToken"],
  },
  deleteOriginalInteractionResponse: {
    method: 'DELETE',
    route: (applicationId, interactionToken) => `/webhooks/${applicationId}/${interactionToken}/messages/@original`,
    params: ["applicationId", "interactionToken"],
  },
  createFollowupMessage: {
    method: 'POST',
    route: (applicationId, interactionToken) => `/webhooks/${applicationId}/${interactionToken}`,
    params: ["applicationId", "interactionToken"],
  },
  getFollowupMessage: {
    method: 'GET',
    route: (applicationId, interactionToken, messageId) => `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`,
    params: ["applicationId", "interactionToken", "messageId"],
  },
  editFollowupMessage: {
    method: 'PATCH',
    route: (applicationId, interactionToken, messageId) => `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`,
    params: ["applicationId", "interactionToken", "messageId"],
  },
  deleteFollowupMessage: {
    method: 'DELETE',
    route: (applicationId, interactionToken, messageId) => `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`,
    params: ["applicationId", "interactionToken", "messageId"],
  },
});

export const Invite = group({
  getInvite: {
    method: 'GET',
    route: (inviteCode) => `/invites/${inviteCode}`,
    params: ["inviteCode"],
  },
  deleteInvite: {
    method: 'DELETE',
    route: (inviteCode) => `/invites/${inviteCode}`,
    params: ["inviteCode"],
  },
});

export const Oauth2 = group({
  getCurrentBotApplicationInformation: {
    method: 'GET',
    route: "/oauth2/applications/@me",
  },
  getCurrentAuthorizationInformation: {
    method: 'GET',
    route: "/oauth2/@me",
  },
});

export const StageInstance = group({
  createStageInstance: {
    method: 'POST',
    route: "/stage-instances",
  },
  getStageInstance: {
    method: 'GET',
    route: (channelId) => `/stage-instances/${channelId}`,
    params: ["channelId"],
  },
  modifyStageInstance: {
    method: 'PATCH',
    route: (channelId) => `/stage-instances/${channelId}`,
    params: ["channelId"],
  },
  deleteStageInstance: {
    method: 'DELETE',
    route: (channelId) => `/stage-instances/${channelId}`,
    params: ["channelId"],
  },
});

export const Sticker = group({
  getSticker: {
    method: 'GET',
    route: (stickerId) => `/stickers/${stickerId}`,
    params: ["stickerId"],
  },
  listNitroStickerPacks: {
    method: 'GET',
    route: "/sticker-packs",
  },
  listGuildStickers: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/stickers`,
    params: ["guildId"],
  },
  getGuildSticker: {
    method: 'GET',
    route: (guildId, stickerId) => `/guilds/${guildId}/stickers/${stickerId}`,
    params: ["guildId", "stickerId"],
  },
  createGuildSticker: {
    method: 'POST',
    route: (guildId) => `/guilds/${guildId}/stickers`,
    params: ["guildId"],
  },
  modifyGuildSticker: {
    method: 'PATCH',
    route: (guildId, stickerId) => `/guilds/${guildId}/stickers/${stickerId}`,
    params: ["guildId", "stickerId"],
  },
  deleteGuildSticker: {
    method: 'DELETE',
    route: (guildId, stickerId) => `/guilds/${guildId}/stickers/${stickerId}`,
    params: ["guildId", "stickerId"],
  },
});

export const User = group({
  getCurrentUser: {
    method: 'GET',
    route: "/users/@me",
  },
  getUser: {
    method: 'GET',
    route: (userId) => `/users/${userId}`,
    params: ["userId"],
  },
  modifyCurrentUser: {
    method: 'PATCH',
    route: "/users/@me",
  },
  getCurrentUserGuilds: {
    method: 'GET',
    route: "/users/@me/guilds",
  },
  getCurrentUserGuildMember: {
    method: 'GET',
    route: (guildId) => `/users/@me/guilds/${guildId}/member`,
    params: ["guildId"],
  },
  leaveGuild: {
    method: 'DELETE',
    route: (guildId) => `/users/@me/guilds/${guildId}`,
    params: ["guildId"],
  },
  createDM: {
    method: 'POST',
    route: "/users/@me/channels",
  },
  createGroupDM: {
    method: 'POST',
    route: "/users/@me/channels",
  },
  getUserConnections: {
    method: 'GET',
    route: "/users/@me/connections",
  },
});

export const Voice = group({
  listVoiceRegions: {
    method: 'GET',
    route: "/voice/regions",
  },
});

export const Webhook = group({
  createWebhook: {
    method: 'POST',
    route: (channelId) => `/channels/${channelId}/webhooks`,
    params: ["channelId"],
  },
  getChannelWebhooks: {
    method: 'GET',
    route: (channelId) => `/channels/${channelId}/webhooks`,
    params: ["channelId"],
  },
  getGuildWebhooks: {
    method: 'GET',
    route: (guildId) => `/guilds/${guildId}/webhooks`,
    params: ["guildId"],
  },
  getWebhook: {
    method: 'GET',
    route: (webhookId) => `/webhooks/${webhookId}`,
    params: ["webhookId"],
  },
  getWebhookWithToken: {
    method: 'GET',
    route: (webhookId, webhookToken) => `/webhooks/${webhookId}/${webhookToken}`,
    params: ["webhookId", "webhookToken"],
  },
  modifyWebhook: {
    method: 'PATCH',
    route: (webhookId) => `/webhooks/${webhookId}`,
    params: ["webhookId"],
  },
  modifyWebhookWithToken: {
    method: 'PATCH',
    route: (webhookId, webhookToken) => `/webhooks/${webhookId}/${webhookToken}`,
    params: ["webhookId", "webhookToken"],
  },
  deleteWebhook: {
    method: 'DELETE',
    route: (webhookId) => `/webhooks/${webhookId}`,
    params: ["webhookId"],
  },
  deleteWebhookWithToken: {
    method: 'DELETE',
    route: (webhookId, webhookToken) => `/webhooks/${webhookId}/${webhookToken}`,
    params: ["webhookId", "webhookToken"],
  },
  executeWebhook: {
    method: 'POST',
    route: (webhookId, webhookToken) => `/webhooks/${webhookId}/${webhookToken}`,
    params: ["webhookId", "webhookToken"],
  },
  executeSlackCompatibleWebhook: {
    method: 'POST',
    route: (webhookId, webhookToken) => `/webhooks/${webhookId}/${webhookToken}/slack`,
    params: ["webhookId", "webhookToken"],
  },
  executeGitHubCompatibleWebhook: {
    method: 'POST',
    route: (webhookId, webhookToken) => `/webhooks/${webhookId}/${webhookToken}/github`,
    params: ["webhookId", "webhookToken"],
  },
  getWebhookMessage: {
    method: 'GET',
    route: (webhookId, webhookToken, messageId) => `/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`,
    params: ["webhookId", "webhookToken", "messageId"],
  },
  editWebhookMessage: {
    method: 'PATCH',
    route: (webhookId, webhookToken, messageId) => `/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`,
    params: ["webhookId", "webhookToken", "messageId"],
  },
  deleteWebhookMessage: {
    method: 'DELETE',
    route: (webhookId, webhookToken, messageId) => `/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`,
    params: ["webhookId", "webhookToken", "messageId"],
  },
});