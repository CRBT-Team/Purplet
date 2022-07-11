import * as REST from 'discord-api-types/rest';
import { Routes } from 'discord-api-types/rest';
import { group, route, type } from '../route-group';

/** https://discord.com/developers/docs/resources/user#get-current-user. */
const getCurrentUser = route({
  method: 'GET',
  route: Routes.user(),
  result: type<REST.RESTGetAPICurrentUserResult>(),
} as const);

/* https://discord.com/developers/docs/resources/user#modify-current-user. */
const modifyCurrentUser = route({
  method: 'PATCH',
  route: Routes.user(),
  body: type<REST.RESTPatchAPICurrentUserJSONBody>(),
  result: type<REST.RESTPatchAPICurrentUserResult>(),
} as const);

/** https://discord.com/developers/docs/resources/user#get-current-user-guilds. */
const getCurrentUserGuilds = route({
  method: 'GET',
  route: Routes.userGuilds(),
  result: type<REST.RESTGetAPICurrentUserGuildsResult>(),
  query: type<REST.RESTGetAPICurrentUserGuildsQuery>(),
} as const);

/** https://discord.com/developers/docs/resources/user#get-current-user-guild-member. */
const getCurrentUserGuildMember = route({
  method: 'GET',
  route: Routes.userGuildMember,
  params: ['guildId'],
  result: type<REST.RESTGetAPIGuildMemberResult>(),
} as const);

/** https://discord.com/developers/docs/resources/user#leave-guild. */
const leaveGuild = route({
  method: 'DELETE',
  route: Routes.userGuild,
  params: ['guildId'],
  result: type<REST.RESTDeleteAPIGuildResult>(),
} as const);

/** https://discord.com/developers/docs/resources/user#create-dm. */
const createDm = route({
  method: 'POST',
  route: Routes.userChannels(),
  body: type<REST.RESTPostAPICurrentUserCreateDMChannelJSONBody>(),
  result: type<REST.RESTPostAPICurrentUserCreateDMChannelResult>(),
} as const);

// This doesn't work, not sure why it's on the developer docs. Whatever.
// Method is implemented in case discord ever decides to make it work.
// /** https://discord.com/developers/docs/resources/user#create-group-dm. */
// const createGroupDm = route({
//   method: 'POST',
//   route: Routes.userChannels,
//   body: type<REST.APIPostCurrentUserCreateGroupDMChannelJSONBody>(),
//   result: type<Rest.APIPostCurrentUserCreateGroupDMChannelResponse>()
// } as const)

/** https://discord.com/developers/docs/resources/user#get-user-connections. */
const getUserConnections = route({
  method: 'GET',
  route: Routes.userConnections(),
  result: type<REST.RESTGetAPICurrentUserConnectionsResult>(),
} as const);

/** Routes on https://discord.com/developers/docs/resources/user. */
export const user = group({
  getCurrentUser,
  modifyCurrentUser,
  getCurrentUserGuilds,
  getCurrentUserGuildMember,
  leaveGuild,
  createDm,
  //createGroupDm,
  getUserConnections,
});
