export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
export type FileData = string | Uint8Array | Blob | ArrayBufferLike;
export type TokenType = 'Bot' | 'Bearer';

export interface RestOptions {
  /** Bot Token. */
  token: string;
  /** API Base URL. */
  base?: string;
  /** API Version. */
  version?: string;
  /** Token type, 'Bot' or 'Bearer' */
  tokenType?: 'Bot' | 'Bearer';
  /** User agent, must be in the form of `DiscordBot ($url, $versionNumber)` */
  userAgent?: string;
}

export interface RequestOptions<Body = unknown, Params = Record<never, never>> {
  body?: Body;
  auth?: boolean; // default true
  headers?: HeadersInit;
  files?: RawFile[];
  query?: Params | URLSearchParams;
}

export interface RequestOptionsWithMethod<Body = unknown, Params = Record<never, never>>
  extends RequestOptions<Body, Params> {
  method: HTTPMethod;
}

export interface RequestData {
  url: string;
  init: RequestInit;
}

export interface RawFile {
  name: string;
  data: FileData;
  key?: string;
}
