import { Dict } from '@davecode/types';
import { Rest } from './Rest';
import { HTTPMethod, RawFile } from './types';

interface Route<Params extends string, Body, Query, Files extends boolean, Result> {
  method: HTTPMethod;
  route: string | ((...args: string[]) => string);
  params?: Params[];
  hasFiles?: Files;
  body?: Body;
  query?: Query;
  result?: Result;
}

type RouteGroup<Routes extends Dict<Route<string, unknown, unknown, boolean, unknown>>> = {
  [K in keyof Routes]: Routes[K] extends Route<
    infer Params,
    infer Body,
    infer Query,
    infer Files,
    infer Result
  >
    ? RemoveParamIfEmpty<
        (
          options: Record<Params, string> &
            (Body extends {} ? { body: Body } : {}) &
            (Query extends {} ? { query: Query } : {}) &
            (Files extends true ? { files: RawFile[] } : {})
        ) => Promise<null | undefined | unknown extends Result ? void : Result>
      >
    : never;
};

type RemoveParamIfEmpty<T> = T extends (options: infer Options) => Promise<infer Result>
  ? {} extends Options
    ? () => Promise<Result>
    : (options: Options) => Promise<Result>
  : never;

export function type<T>(): T;

export function route<Params extends string, Body, Query, Files extends boolean, Result>(
  routeData: Route<Params, Body, Query, Files, Result>
): Route<Params, Body, Query, Files, Result>;

export function group<Routes extends Dict<Route<string, unknown, unknown, boolean, unknown>>>(
  routes: Routes
): (bindTo: Rest) => RouteGroup<Routes>;
