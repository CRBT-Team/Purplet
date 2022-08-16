// Taken from

import type { ArrayBufferable, FileData, Streamable } from './types';

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

function isArrayBufferable(data: FileData): data is ArrayBufferable {
  return typeof (data as ArrayBufferable).arrayBuffer === 'function';
}

function isStreamable(data: FileData): data is Streamable {
  return typeof (data as Streamable).stream === 'function';
}

function isAsyncIterable(
  data: FileData
): data is AsyncIterable<string | Uint8Array | Blob | ArrayBufferLike | Buffer> {
  return typeof (data as AsyncIterable<FileData>)[Symbol.asyncIterator] === 'function';
}

export async function toBlob(data: FileData): Promise<Blob> {
  if (data instanceof Blob) {
    return data;
  }
  if (isArrayBufferable(data)) {
    return new Blob([await data.arrayBuffer()]);
  }
  if (isStreamable(data)) {
    const stream = data.stream().getReader();
    const values = [];

    let read;
    do {
      read = await stream.read();
      read.value && values.push(read.value);
    } while (!read.done);

    return new Blob(values);
  }
  if (isAsyncIterable(data)) {
    const values = [];

    for await (const value of data) {
      values.push(value);
    }

    return new Blob(values);
  }
  return new Blob([data]);
}
