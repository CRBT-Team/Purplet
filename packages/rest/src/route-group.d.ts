// idk entirely on these types, but they work good enough

import { Dict, ForceSimplify } from '@davecode/types';
import { Rest } from './Rest';
import { HTTPMethod, RawFile } from './types';

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
          (Routes[K]['body'] extends {} ? { body: Routes[K]['body'] } : {}) &
          (Routes[K]['query'] extends {} ? { query: Routes[K]['query'] } : {}) &
          (Routes[K]['file'] extends true ? { files?: RawFile[] } : {}) &
          (Routes[K]['reason'] extends true ? { reason?: string } : {})
      >
    ) => Promise<undefined | unknown extends Routes[K]['result'] ? void : Routes[K]['result']>
  >;
};

type RemoveParamIfEmpty<T> = T extends (options: infer Options) => Promise<infer Result>
  ? {} extends Options
    ? () => Promise<Result>
    : (options: Options) => Promise<Result>
  : never;

export function group<Routes extends Dict<any>>(
  routes: Routes
): { new (rest: Rest): ForceSimplify<RouteGroup<Routes>> };
