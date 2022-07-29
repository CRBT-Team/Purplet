// idk entirely on these types, but they work good enough

import type { Dict, ForceSimplify } from '@davecode/types';
import type { Rest } from './Rest';
import type { HTTPMethod, RawFile } from './types';

interface RouteMeta {
  method: HTTPMethod;
  route: string | ((...args: string[]) => string);
  params?: Params[];
  body?: unknown;
  query?: unknown;
  result?: unknown;
  file?: boolean;
  reason?: boolean;
}

export type Route<Meta extends Omit<RouteMeta, 'method' | 'route'>> = Meta & {
  method: HTTPMethod;
  route: string;
};

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

type MakeEmptyOptional<T> = ForceSimplify<
  Pick<T, NonEmptyKeys<T>> & Partial<Pick<T, EmptyKeys<T>>>
>;

type RouteGroup<Routes extends Dict<RouteMeta>> = {
  [K in keyof Routes]: RemoveParamIfEmpty<
    (
      options: MakeEmptyOptional<
        Record<Routes[K]['params'][number], string> &
          (Routes[K]['body'] extends Dict<unknown> ? { body: Routes[K]['body'] } : EmptyObject) &
          (Routes[K]['query'] extends Dict<unknown> ? { query: Routes[K]['query'] } : EmptyObject) &
          (Routes[K]['file'] extends true ? { files?: RawFile[] } : EmptyObject) &
          (Routes[K]['reason'] extends true ? { reason?: string } : EmptyObject)
      >
    ) => Promise<unknown extends Routes[K]['result'] ? undefined : Routes[K]['result']>
  >;
};

type RemoveParamIfEmpty<T> = T extends (options: infer Options) => Promise<infer Result>
  ? Dict<unknown> extends Options
    ? () => Promise<Result>
    : (options: Options) => Promise<Result>
  : never;

export type RouteGroupClass<Routes> = new (rest: Rest) => ForceSimplify<Routes>;

export function group<Routes extends Dict<any>>(
  routes: Routes
): RouteGroupClass<RouteGroup<Routes>>;
