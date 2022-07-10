import * as REST from 'discord-api-types/rest';
import { Routes } from 'discord-api-types/rest';
import { group, route, type } from './route-group';

export const auditLog = group({
  getGuildAuditLog: route({
    method: 'GET',
    route: Routes.guildAuditLog,
    params: ['guildId'],
    result: type<REST.RESTGetAPIAuditLogResult>(),
  }),
});

export const autoModeration = group({});

export const channel = group({});

export const emoji = group({});

export const guild = group({});

export const guildScheduledEvent = group({});

export const guildTemplate = group({});

export const invite = group({});

export const stageInstance = group({});

export const sticker = group({});

export const user = group({
  /** https://discord.com/developers/docs/resources/user#get-current-user. */
  getCurrentUser: route({
    method: 'GET',
    route: Routes.user(),
    result: type<REST.RESTGetAPICurrentUserResult>(),
  }),
  /** https://discord.com/developers/docs/resources/user#modify-current-user. */
  modifyCurrentUser: route({
    method: 'PATCH',
    route: Routes.user(),
    body: type<REST.RESTPatchAPICurrentUserJSONBody>(),
    result: type<REST.RESTPatchAPICurrentUserResult>(),
  }),
  /** https://discord.com/developers/docs/resources/user#get-current-user-guilds. */
  getCurrentUserGuilds: route({
    method: 'GET',
    route: Routes.userGuilds(),
    result: type<REST.RESTGetAPICurrentUserGuildsResult>(),
    query: type<REST.RESTGetAPICurrentUserGuildsQuery>(),
  }),
  /** https://discord.com/developers/docs/resources/user#get-current-user-guild-member. */
  getCurrentUserGuildMember: route({
    method: 'GET',
    route: Routes.userGuildMember,
    params: ['guildId'],
    result: type<REST.RESTGetAPIGuildMemberResult>(),
  }),
  /** https://discord.com/developers/docs/resources/user#leave-guild. */
  leaveGuild: route({
    method: 'DELETE',
    route: Routes.userGuild,
    params: ['guildId'],
    result: type<REST.RESTDeleteAPIGuildResult>(),
  }),
  /** https://discord.com/developers/docs/resources/user#create-dm. */
  createDM: route({
    method: 'POST',
    route: Routes.userChannels(),
    body: type<REST.RESTPostAPICurrentUserCreateDMChannelJSONBody>(),
    result: type<REST.RESTPostAPICurrentUserCreateDMChannelResult>(),
  }),
  // Excluded: https://discord.com/developers/docs/resources/user#create-group-dm
  /** https://discord.com/developers/docs/resources/user#get-user-connections. */
  getUserConnections: route({
    method: 'GET',
    route: Routes.userConnections(),
    result: type<REST.RESTGetAPICurrentUserConnectionsResult>(),
  }),
});

export const voice = group({});

export const webhook = group({});
