import * as REST from 'discord-api-types/rest';
import { Routes } from 'discord-api-types/rest';
import { group, route, type } from '../route-group';

/** Routes on https://discord.com/developers/docs/resources/voice. */
export const voice = group({
  listVoiceRegions: route({
    method: 'GET',
    route: Routes.voiceRegions(),
    result: type<REST.RESTGetAPIGuildVoiceRegionsResult>(),
  } as const),
});
