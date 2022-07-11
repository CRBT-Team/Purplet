import '../RouteImports';

/** Routes on https://discord.com/developers/docs/resources/user. */
export const user = group({
  /** https://discord.com/developers/docs/resources/user#get-current-user. */
  getCurrentUser: route({
    method: 'GET',
    route: Routes.user(),
    result: type<REST.RESTGetAPICurrentUserResult>(),
  } as const),
  /** https://discord.com/developers/docs/resources/user#modify-current-user. */
  modifyCurrentUser: route({
    method: 'PATCH',
    route: Routes.user(),
    body: type<REST.RESTPatchAPICurrentUserJSONBody>(),
    result: type<REST.RESTPatchAPICurrentUserResult>(),
  } as const),
  /** https://discord.com/developers/docs/resources/user#get-current-user-guilds. */
  getCurrentUserGuilds: route({
    method: 'GET',
    route: Routes.userGuilds(),
    result: type<REST.RESTGetAPICurrentUserGuildsResult>(),
    query: type<REST.RESTGetAPICurrentUserGuildsQuery>(),
  } as const),
  /** https://discord.com/developers/docs/resources/user#get-current-user-guild-member. */
  getCurrentUserGuildMember: route({
    method: 'GET',
    route: Routes.userGuildMember,
    params: ['guildId'],
    result: type<REST.RESTGetAPIGuildMemberResult>(),
  } as const),
  /** https://discord.com/developers/docs/resources/user#leave-guild. */
  leaveGuild: route({
    method: 'DELETE',
    route: Routes.userGuild,
    params: ['guildId'],
    result: type<REST.RESTDeleteAPIGuildResult>(),
  } as const),
  /** https://discord.com/developers/docs/resources/user#create-dm. */
  createDM: route({
    method: 'POST',
    route: Routes.userChannels(),
    body: type<REST.RESTPostAPICurrentUserCreateDMChannelJSONBody>(),
    result: type<REST.RESTPostAPICurrentUserCreateDMChannelResult>(),
  } as const),
  // Excluded: https://discord.com/developers/docs/resources/user#create-group-dm
  /** https://discord.com/developers/docs/resources/user#get-user-connections. */
  getUserConnections: route({
    method: 'GET',
    route: Routes.userConnections(),
    result: type<REST.RESTGetAPICurrentUserConnectionsResult>(),
  } as const),
});