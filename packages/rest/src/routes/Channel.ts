import * as REST from 'discord-api-types/rest';
import { Routes } from 'discord-api-types/rest';
import { group, route, type } from '../route-group';

const getChannel = route({
  method: 'GET',
  route: Routes.channel,
  params: ['channelId'],
  result: type<REST.RESTGetAPIChannelResult>(),
} as const);

const modifyChannel = route({
  method: 'PATCH',
  route: Routes.channel,
  params: ['channelId'],
  body: type<REST.RESTPatchAPIChannelJSONBody>(),
  result: type<REST.RESTPatchAPIChannelResult>(),
  reason: true,
} as const);

const deleteChannel = route({
  method: 'DELETE',
  route: Routes.channel,
  params: ['channelId'],
  result: type<REST.RESTDeleteAPIChannelResult>(),
  reason: true,
} as const);

const getChannelMessages = route({
  method: 'GET',
  route: Routes.channelMessages,
  params: ['channelId'],
  result: type<REST.RESTGetAPIChannelMessagesResult>(),
} as const);

const getChannelMessage = route({
  method: 'GET',
  route: Routes.channelMessage,
  params: ['channelId', 'messageId'],
  result: type<REST.RESTGetAPIChannelMessageResult>(),
} as const);

const createMessage = route({
  method: 'POST',
  route: Routes.channelMessages,
  params: ['channelId'],
  body: type<REST.RESTPostAPIChannelMessageJSONBody>(),
  result: type<REST.RESTPostAPIChannelMessageResult>(),
  files: true,
} as const);

const crosspostMessage = route({
  method: 'POST',
  route: Routes.channelMessageCrosspost,
  params: ['channelId', 'messageId'],
  result: type<REST.RESTPostAPIChannelMessageCrosspostResult>(),
} as const);

const createReaction = route({
  method: 'PUT',
  route: Routes.channelMessageOwnReaction,
  params: ['channelId', 'messageId', 'emoji'],
  result: type<REST.RESTPutAPIChannelMessageReactionResult>(),
} as const);

const deleteOwnReaction = route({
  method: 'DELETE',
  route: Routes.channelMessageOwnReaction,
  params: ['channelId', 'messageId', 'emoji'],
} as const);

const deleteUserReacion = route({
  method: 'DELETE',
  route: Routes.channelMessageUserReaction,
  params: ['channelId', 'messageId', 'emoji', 'userId'],
});

const getReactions = route({
  method: 'GET',
  route: Routes.channelMessageReaction,
  params: ['channelId', 'messageId', 'emoji'],
  query: type<REST.RESTGetAPIChannelMessageReactionUsersQuery>(),
  result: type<REST.RESTGetAPIChannelMessageReactionUsersResult>(),
} as const);

const deleteAllReactions = route({
  method: 'DELETE',
  route: Routes.channelMessageAllReactions,
  params: ['channelId', 'messageId'],
} as const);

const deleteAllReactionsForEmoji = route({
  method: 'DELETE',
  route: Routes.channelMessageReaction,
  params: ['channelId', 'messageId', 'emoji'],
} as const);

/** Routes on https://discord.com/developers/docs/resources/channel. */
export const channel = group({
  /** https://discord.com/developers/docs/resources/channel#get-channel. */
  getChannel,
  /** https://discord.com/developers/docs/resources/channel#modify-channel. */
  modifyChannel,
  /** https://discord.com/developers/docs/resources/channel#delete-channel. */
  deleteChannel,
  /** https://discord.com/developers/docs/resources/channel#get-channel-messages. */
  getChannelMessages,
  /** https://discord.com/developers/docs/resources/channel#get-channel-message. */
  getChannelMessage,
  /** https://discord.com/developers/docs/resources/channel#create-message. */
  createMessage,
  /** https://discord.com/developers/docs/resources/channel#crosspost-message. */
  crosspostMessage,
  /** https://discord.com/developers/docs/resources/channel#create-reaction. */
  createReaction,
  /** https://discord.com/developers/docs/resources/channel#delete-own-reaction. */
  deleteOwnReaction,
  /** https://discord.com/developers/docs/resources/channel#delete-user-reaction. */
  deleteUserReacion,
  /** https://discord.com/developers/docs/resources/channel#get-reactions. */
  getReactions,
  /** https://discord.com/developers/docs/resources/channel#delete-all-reactions. */
  deleteAllReactions,
  /** https://discord.com/developers/docs/resources/channel#delete-all-reactions-for-emoji. */
  deleteAllReactionsForEmoji,
  // editMessage,
  // deleteMessage,
  // bulkDeleteMessages,
  // editChannelPermissions,
  // getChannelInvites,
  // createChannelInvite,
  // deleteChannelPermission,
  // followNewsChannel,
  // triggerTypingIndicator,
  // getPinnedMessages,
  // pinMessag,
  // unpinMessage,
  // groupDMAddRecipient,
  // groupDMRemoveRecipient,
  // startThreadFromMessage,
  // startThreadWithoutMessage,
  // startThreadInForumChannel,
  // joinThread,
  // addThreadMember,
  // leaveThread,
  // removeThreadMember,
  // getThreadMember,
  // listThreadMembers,
  // listPublicArchivedThreads,
  // listPrivateArchivedThreads,
  // listJoinedPrivateArchivedThreads
});
