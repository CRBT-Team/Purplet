import * as REST from 'discord-api-types/rest';
import { group, route, type } from '../route-group';
import { Routes } from 'discord-api-types/rest';

/** Routes on https://discord.com/developers/docs/resources/channel. */
export const channel = group({
  createMessage: route({
    method: 'POST',
    route: Routes.channelMessages,
    params: ['channelId'],
    result: type<REST.RESTPostAPIChannelMessageResult>(),
    body: type<REST.RESTPostAPIChannelMessageJSONBody>(),
    files: true,
  } as const),
});
