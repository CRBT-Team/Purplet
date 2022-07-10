import * as REST from 'discord-api-types/rest';
import { Routes } from 'discord-api-types/rest';
import { group, route, type } from './route-group';

/* Routes on https://discord.com/developers/docs/interactions/application-commands */
export const applicationCommand = group({});

/** Routes on https://discord.com/developers/docs/interactions/receiving-and-responding. */
export const interactionResponse = group({});

/** Routes on https://discord.com/developers/docs/resources/audit-log. */
export const auditLog = group({
  getGuildAuditLog: route({
    method: 'GET',
    route: Routes.guildAuditLog,
    params: ['guildId'] as const,
    result: type<REST.RESTGetAPIAuditLogResult>(),
  }),
});

/** Routes on https://discord.com/developers/docs/resources/auto-moderation. */
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

/** Routes on https://discord.com/developers/docs/resources/channel. */
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

/** Routes on https://discord.com/developers/docs/resources/emoji. */
export const emoji = group({});

/** Routes on https://discord.com/developers/docs/resources/guild. */
export const guild = group({});

/** Routes on https://discord.com/developers/docs/resources/guild-scheduled-event. */
export const guildScheduledEvent = group({});

/** Routes on https://discord.com/developers/docs/resources/guild-template. */
export const guildTemplate = group({});

/** Routes on https://discord.com/developers/docs/resources/invite. */
export const invite = group({});

/** Routes on https://discord.com/developers/docs/resources/stage-instance. */
export const stageInstance = group({});

/** Routes on https://discord.com/developers/docs/resources/sticker. */
export const sticker = group({});

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

/** Routes on https://discord.com/developers/docs/resources/voice. */
export const voice = group({
  listVoiceRegions: route({
    method: 'GET',
    route: Routes.voiceRegions(),
    result: type<REST.RESTGetAPIGuildVoiceRegionsResult>(),
  } as const),
});

/** Routes on https://discord.com/developers/docs/resources/webhook. */
export const webhook = group({});

/** Routes on https://discord.com/developers/docs/topics/gateway. */
export const gateway = group({
  getGateway: route({
    method: 'GET',
    route: Routes.gateway(),
    result: type<REST.RESTGetAPIGatewayResult>(),
    auth: false,
  } as const),
  getGatewayBot: route({
    method: 'GET',
    route: Routes.gatewayBot(),
    result: type<REST.RESTGetAPIGatewayBotResult>(),
  } as const),
});

/** Routes on https://discord.com/developers/docs/topics/oauth2. */
export const oauth2 = group({});
