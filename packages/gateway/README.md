# @purplet/gateway

This is a JavaScript implementation for the Discord Gateway API. It is very light, and doesn't do more than is needed. We do not depend on any runtime-specific apis, but rather the `fetch` and `WebSocket` standard APIs, meaning this client can run in Node.js (with polyfills), and in Bun.js.

## Installing

`@purplet/gateway` only a peer-dependency on `discord-api-types` so you we do not have to bump this package when types change slightly. We also utilize `zlib-sync` for compression and `erlpack` for encoding (these don't work on bun yet).

```sh
pnpm install @purplet/gateway discord-api-types
# or
bun add @purplet/gateway discord-api-types
```

### Node.js support

Until v18, node.js does not support `fetch`, and no version of node has `WebSocket` built-in. You will need a polyfill to use this library.

An example polyfill:

```ts
import { WebSocket } from 'ws';
import fetch from 'node-fetch';

globalThis.WebSocket = WebSocket;
globalThis.fetch = fetch;
```
