// Modelled after https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/WebSocket.js
import type { Dict } from '@davecode/types';
import { ClientOptions, WebSocket } from 'ws';

let erlpack: typeof import('erlpack') | undefined = undefined;
try {
  erlpack = (await import('erlpack')).default;
} catch {}

const textDecoder = new TextDecoder();

export const encoding = erlpack ? 'etf' : 'json';

export const packETF = erlpack ? erlpack.pack : JSON.stringify;

export function unpackETF(data: any, type?: 'json') {
  if (encoding === 'json' || type === 'json') {
    if (typeof data !== 'string') {
      data = textDecoder.decode(data);
    }
    return JSON.parse(data);
  }
  // TODO: see if this line converting stuff to a buffer is necessary
  if (!Buffer.isBuffer(data)) data = Buffer.from(new Uint8Array(data));
  return erlpack!.unpack(data);
}

export function createWebsocket(
  gateway: string,
  query: Dict<string | undefined> = {},
  wsOptions: ClientOptions = {}
) {
  const [g, q] = gateway.split('?');
  query.encoding = encoding;
  const searchParams = new URLSearchParams(query as Dict<string>);
  if (q) new URLSearchParams(q).forEach((v, k) => searchParams.set(k, v));
  return new WebSocket(`${g}?${query}`, wsOptions);
}
