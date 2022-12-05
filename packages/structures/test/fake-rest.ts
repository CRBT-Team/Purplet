import { Rest } from '@purplet/rest';
import { rest, setStructuresRest } from '../src/global';

export interface FakeRestRoutes {
  get?: Record<string, () => any>;
  post?: Record<string, (data: any) => any>;
  put?: Record<string, (data: any) => any>;
  delete?: Record<string, () => any>;
  patch?: Record<string, (data: any) => any>;
}

export function initFakeRest(routes: FakeRestRoutes) {
  setStructuresRest(
    new Rest({
      token: 'n/a',
      fetch: (async (url: any, init: any) => {
        const path = new URL(url as any).pathname.replace(/^\/api\/v\d+/, '');

        if (init.method === 'GET') {
          const getter = routes.get?.[path];
          if (getter) {
            return Response.json(getter());
          }
        } else if (init.method === 'POST') {
          const poster = routes.post?.[path];
          if (poster) {
            return Response.json(poster(await new Response(init.body).json()));
          }
        } else if (init.method === 'PUT') {
          const putter = routes.put?.[path];
          if (putter) {
            return Response.json(putter(await new Response(init.body).json()));
          }
        } else if (init.method === 'DELETE') {
          const deleter = routes.delete?.[path];
          if (deleter) {
            return Response.json(deleter());
          }
        } else if (init.method === 'PATCH') {
          const patcher = routes.patch?.[path];
          if (patcher) {
            return Response.json(patcher(await new Response(init.body).json()));
          }
        }
        throw new Error(`FakeRest: no route for ${init.method} ${path}`);
      }) as any,
    })
  );
  return rest;
}
