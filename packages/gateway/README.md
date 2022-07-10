# @purplet/gateway

This is a JavaScript implementation for the Discord Gateway API. It is very light, and doesn't do more than is needed. We do not depend on any runtime-specific apis, but rather the `fetch` and `WebSocket` standard APIs, meaning this client can run in Node.js (with polyfills), and in Bun.js.

Basic Example:

```ts
import { Gateway } from '@purplet/gateway';
import { GatewayIntentBits } from 'discord-api-types/gateway';

const client = new Gateway({
  intents: GatewayIntentBits.GuildMessages,
  token: process.env.token
});

client.on('MESSAGE_CREATE', message => {
  console.log(message);
});
```

## Installing

`@purplet/gateway` only a peer-dependency on `discord-api-types` so you we do not have to bump this package when types change slightly. We also utilize `zlib-sync` for compression and `erlpack` for encoding (these don't work on bun yet).

```sh
pnpm install @purplet/gateway discord-api-types
# or
bun add @purplet/gateway discord-api-types
```

## Node.js support

Until v18, node.js does not support `fetch`, and no version of node has `WebSocket` built-in. We provide another package, `@purplet/polyfill` which polyfills these APIs for you:

```ts
import '@purplet/polyfill';
import { Gateway } from '@purplet/gateway';
// ...
```
