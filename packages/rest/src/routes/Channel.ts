import * as REST from 'discord-api-types/rest';
import { group, route, type } from '../route-group';
import { Routes } from 'discord-api-types/rest';

/** https://discord.com/developers/docs/resources/channel#get-channel. */
const getChannel = route({
  method: "GET",
  route: Routes.channel,
  params: ["channelId"],
  result: type<REST.RESTGetAPIChannelResult>(),
} as const);

/** https://discord.com/developers/docs/resources/channel#modify-channel. */
const modifyChannel = route({
  method: "PATCH",
  route: Routes.channel,
  params: ["channelId"],
  body: type<REST.RESTPatchAPIChannelJSONBody>(),
  result: type<REST.RESTPatchAPIChannelResult>(),
  reason: true,
} as const);

/** https://discord.com/developers/docs/resources/channel#delete-channel. */
const deleteChannel = route({
  method: "DELETE",
  route: Routes.channel,
  params: ["channelId"],
  result: type<REST.RESTDeleteAPIChannelResult>(),
  reason: true,
} as const);

/** Routes on https://discord.com/developers/docs/resources/channel. */
export const channel = group({
  getChannel,
  modifyChannel,
  deleteChannel,
  // getChannelMessages,
  // getChannelMessage,
  // createMessage,
  // crosspostMessage,
  // createReaction,
  // deleteOwnReaction,
  // deleteUserReacion,
  // getReactions,
  // deleteAllReactions,
  // deleteAllReactionsForEmoji,
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
