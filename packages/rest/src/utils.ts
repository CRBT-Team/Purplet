// Taken from
// https://github.com/discordjs/discord.js/blob/main/packages/rest/src/lib/RequestManager.ts#L479
export function classifyEndpoint(endpoint: string, method: string) {
  const majorIdMatch = /^\/(?:channels|guilds|webhooks)\/(\d{16,19})/.exec(endpoint);

  // Get the major id for this route - global otherwise
  const majorId = majorIdMatch?.[1] ?? 'global';

  let baseRoute = endpoint
    // Strip out all ids
    .replace(/\d{16,19}/g, ':id')
    // Strip out reaction as they fall under the same bucket
    .replace(/\/reactions\/(.*)/, '/reactions/:reaction');

  // Hard-Code Old Message Deletion Exception (2 week+ old messages are a different bucket)
  // https://github.com/discord/discord-api-docs/issues/1295
  if (method === 'DELETE' && baseRoute === '/channels/:id/messages/:id') {
    const id = /\d{16,19}$/.exec(endpoint)![0]!;
    const timestamp = Number((BigInt(id) >> 22n) + 1420070400000n);
    if (Date.now() - timestamp > 1000 * 60 * 60 * 24 * 14) {
      baseRoute += '/OLD';
    }
  }

  return { endpointId: `${method}:${baseRoute}`, majorId };
}
