import * as REST from 'discord-api-types/rest';
import { Routes } from 'discord-api-types/rest';
import { group, route, type } from '../route-group';

export const guild = group({
  createGuild: route({
    method: 'POST',
    route: Routes.guilds,
    body: type<REST.RESTPostAPIGuildsJSONBody>(),
    result: type<REST.RESTPostAPIGuildsResult>(),
  } as const),
  getGuild: route({
    method: 'GET',
    route: Routes.guild,
    params: ['guildId'],
    result: type<REST.RESTGetAPIGuildResult>(),
  } as const),
  getGuildPreview: route({
    method: 'GET',
    route: Routes.guildPreview,
    params: ['guildId'],
    result: type<REST.RESTDeleteAPIGuildResult>(),
  } as const),
  modifyGuild: route({
    method: 'GET',
    route: Routes.guildPreview,
    params: ['guildId'],
    body: type<REST.RESTPatchAPIGuildJSONBody>(),
    result: type<REST.RESTPatchAPIGuildResult>(),
    reason: true,
  } as const),
  deleteGuild: route({
    method: 'DELETE',
    route: Routes.guild,
    params: ['guildId'],
    result: type<REST.RESTDeleteAPIGuildResult>(),
  } as const),
  getGuildChannels: route({
    method: 'GET',
    route: Routes.guildChannels,
    params: ['guildId'],
    result: type<REST.RESTGetAPIGuildChannelsResult>(),
  } as const),
});
