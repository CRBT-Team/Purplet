/* eslint-disable @typescript-eslint/ban-types */
// idk entirely on these types, but they work good enough

import type { EmptyObject, ForceSimplify } from '@paperdave/utils';
import type { Rest } from './Rest';
import type { RawFile } from './types';

interface RouteMeta {
  params?: Params[];
  body?: unknown;
  query?: unknown;
  result?: unknown;
  file?: boolean;
  reason?: boolean;
}

type UnknownToEmptyObject<T> = unknown extends T ? EmptyObject : T;

type RemoveParamIfEmpty<T> = T extends (options: infer Options) => Promise<infer Result>
  ? EmptyObject extends Options
    ? () => Promise<Result>
    : (options: Options) => Promise<Result>
  : never;

type EmptyKeys<T> = {
  [K in keyof T]: T extends Dict<unknown>
    ? Record<never, unknown> extends T[K]
      ? K
      : never
    : never;
}[keyof T];

type NonEmptyKeys<T> = {
  [K in keyof T]: T extends Dict<unknown> ? (Record<never, unknown> extends T[K] ? never : K) : K;
}[keyof T];

type MakeEmptyOptional<T> = Pick<T, NonEmptyKeys<T>> & Partial<Pick<T, EmptyKeys<T>>>;

export type Route<Meta extends RouteMeta> = RemoveParamIfEmpty<
  (
    options: MakeEmptyOptional<
      {
        /** Parameter. */
        [K in Meta['params'][number]]: string;
      } & (Meta['query'] extends {}
        ? {
            /** The query string to send in this request. */
            query: Meta['query'];
          }
        : {}) &
        (Meta['reason'] extends true
          ? {
              /** The reason for this request. This will be sent in the `X-Audit-Log-Reason` header. */
              reason?: string;
            }
          : {}) &
        (Meta['file'] extends boolean
          ? {
              /** The files to be uploaded with this request. */
              files?: RawFile[];
            }
          : {})
    > &
      (Meta['body'] extends Dict<unknown>
        ? {
            /** The JSON data to send in this request. */
            body: Meta['body'];
          }
        : {})
  ) => Promise<unknown extends Meta['result'] ? undefined : Meta['result']>
>;

type RouteGroup<X> = X;

export type RouteGroupClass<Routes> = new (rest: Rest) => ForceSimplify<Routes>;

export function group<Routes>(routes: Routes): RouteGroupClass<Routes>;
