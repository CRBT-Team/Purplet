import * as REST from 'discord-api-types/rest';
import { Routes } from 'discord-api-types/rest';
import { group, route, type } from './route-group';

export const auditLog = group({
  getGuildAuditLog: route({
    method: 'GET',
    route: Routes.guildAuditLog,
    params: ['guildId'] as const,
    result: type<REST.RESTGetAPIAuditLogResult>(),
  }),
});

export const autoModeration = group({
  // TODO: uncomment when discord
  // listAutoModerationRulesForGuild: route({
  //   method: 'GET',
  //   route: guild => `/guilds/${guild}/auto-moderation/rules`,
  //   params: ['guildId'],
  //   result: type<REST.RESTGetAPIGuildAutoModerationRulesResult>(),
  // } as const),
  // getAutoModerationRule: route({
  //   method: 'GET',
  //   route: (guild, rule) => `/guilds/${guild}/auto-moderation/rules/${rule}`,
  //   params: ['guildId', 'autoModerationRuleId'],
  //   result: type<REST.RESTGetAPIGuildAutoModerationRuleResult>(),
  // } as const),
  // createAutoModerationRule: route({
  //   method: 'POST',
  //   route: guild => `/guilds/${guild}/auto-moderation/rules`,
  //   params: ['guildId'],
  //   result: type<REST.RESTPostAPIGuildAutoModerationRuleResult>(),
  //   body: type<REST.RESTPostAPIGuildAutoModerationRuleJSONBody>(),
  // } as const),
  // modifyAutoModerationRule: route({
  //   method: 'PATCH',
  //   route: (guild, rule) => `/guilds/${guild}/auto-moderation/rules/${rule}`,
  //   params: ['guildId', 'autoModerationRuleId'],
  //   result: type<REST.RESTPatchAPIGuildAutoModerationRuleResult>(),
  //   body: type<REST.RESTPatchAPIGuildAutoModerationRuleJSONBody>(),
  // } as const),
});

export const channel = group({
  createMessage: route({
    method: 'POST',
    route: Routes.channelMessage,
    params: ['channelId'],
    result: type<REST.RESTPostAPIChannelMessageResult>(),
    body: type<REST.RESTPostAPIChannelMessageJSONBody>(),
    files: true,
  } as const),
});

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
    params: ['guildId'] as const,
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

export const voice = group({
  listVoiceRegions: route({
    method: 'GET',
    route: Routes.voiceRegions(),
    result: type<REST.RESTGetAPIGuildVoiceRegionsResult>(),
  }),
});

export const webhook = group({});
