import '../RouteImports';

/** Routes on https://discord.com/developers/docs/resources/voice. */
export const voice = group({
  listVoiceRegions: route({
    method: 'GET',
    route: Routes.voiceRegions(),
    result: type<REST.RESTGetAPIGuildVoiceRegionsResult>(),
  } as const),
});
