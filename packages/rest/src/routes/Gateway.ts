import * as REST from 'discord-api-types/rest';
import { Routes } from 'discord-api-types/rest';
import { group, route, type } from '../route-group';

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
