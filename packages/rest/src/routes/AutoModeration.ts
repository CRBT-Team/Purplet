import * as REST from 'discord-api-types/rest';
import { Routes } from 'discord-api-types/rest';
import { group, route, type } from '../route-group';

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
