interface ArrayBufferable {
  arrayBuffer(): Promise<ArrayBuffer>;
}

interface Streamable {
  stream(): ReadableStream<Uint8Array>;
}

export type BlobResolvable =
  | string
  | Uint8Array
  | Blob
  | ArrayBufferLike
  | ArrayBufferable
  | Streamable
  | Buffer
  | AsyncIterable<string | Uint8Array | Blob | ArrayBufferLike | Buffer>;

function isArrayBufferable(data: BlobResolvable): data is ArrayBufferable {
  return typeof (data as ArrayBufferable).arrayBuffer === 'function';
}

function isStreamable(data: BlobResolvable): data is Streamable {
  return typeof (data as Streamable).stream === 'function';
}

function isAsyncIterable(
  data: BlobResolvable
): data is AsyncIterable<string | Uint8Array | Blob | ArrayBufferLike | Buffer> {
  return typeof (data as AsyncIterable<BlobResolvable>)[Symbol.asyncIterator] === 'function';
}

export async function toBlob(data: BlobResolvable): Promise<Blob> {
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
