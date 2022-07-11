import { Dict, ForceSimplify } from '@davecode/types';
import { Rest } from './Rest';
import { HTTPMethod, RawFile } from './types';

interface Route<
  Params extends string,
  Body,
  Query,
  Files extends boolean,
  Reason extends boolean,
  Result
> {
  method: HTTPMethod;
  route: string | ((...args: string[]) => string);
  params?: Array<Params> | ReadonlyArray<Params>;
  files?: Files;
  body?: Body;
  query?: Query;
  result?: Result;
  reason?: Reason;
}

type RouteGroup<Routes extends Dict<Route>> = {
  [K in keyof Routes]: Routes[K] extends Route
    ? RemoveParamIfEmpty<
        (
          options: Record<Routes[K]['params'][number], string> &
            (Routes[K]['body'] extends {} ? { body: Routes[K]['body'] } : {}) &
            (Routes[K]['query'] extends {} ? { query: Routes[K]['query'] } : {}) &
            (Routes[K]['files'] extends true ? { files?: RawFile[] } : {}) &
            (Routes[K]['reason'] extends true ? { reason?: string } : {})
        ) => Promise<null | undefined | unknown extends Result ? void : Result>
      >
    : never;
};

type RemoveParamIfEmpty<T> = T extends (options: infer Options) => Promise<infer Result>
  ? {} extends Options
    ? () => Promise<Result>
    : (options: ForceSimplify<Options>) => Promise<Result>
  : never;

export function type<T>(): T;

export function route<R extends Route>(routeData: R): R;

export function group<Routes extends Dict<any>>(
  routes: Routes
): (bindTo: Rest) => ForceSimplify<RouteGroup<Routes>>;
