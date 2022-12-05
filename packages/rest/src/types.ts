import type { BlobResolvable } from '@purplet/utils';

export { BlobResolvable };

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
export type TokenType = 'Bot' | 'Bearer';

export interface ArrayBufferable {
  arrayBuffer(): Promise<ArrayBuffer>;
}

export interface Streamable {
  stream(): ReadableStream<Uint8Array>;
}

export interface NodeReadableLike {}

export interface RestOptions {
  /** Bot Token. */
  token: string;
  /** API Base URL. */
  base?: string;
  /** API Version. */
  version?: string;
  /** Token type, 'Bot' or 'Bearer' */
  tokenType?: TokenType;
  /** User agent, must be in the form of `DiscordBot ($url, $versionNumber)` */
  userAgent?: string;
  /** Fetch function to use. */
  fetch?: typeof fetch;
}

export interface RequestOptions<Body = unknown, Query = Record<never, never>> {
  body?: Body;
  auth?: boolean; // default true
  headers?: HeadersInit;
  files?: RawFile[];
  query?: Query | URLSearchParams;
  reason?: string;
}

export interface RequestOptionsWithMethod<Body = unknown, Query = Record<never, never>>
  extends RequestOptions<Body, Query> {
  method: HTTPMethod;
}

export interface RequestData {
  url: URL;
  init: RequestInit;
}

export interface RawFile {
  name: string;
  data: BlobResolvable;
  key?: string;
}
