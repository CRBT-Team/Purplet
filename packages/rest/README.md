# @purplet/rest

This is a JavaScript implementation for the Discord REST API. It is very light, and doesn't do more than is needed. We do not depend on any runtime-specific apis, but rather the `fetch` and `FormData` standard APIs, meaning this client can run in Node.js and in Bun (with polyfills). Every route is fully typed and hand-tested.

Basic Example:

```ts
import { Rest } from '@purplet/rest';

const rest = new Rest({ token: process.env.token });

const me = await rest.user.getCurrentUser();
```

All routes are based off of the [Discord API Docs](https://discordapp.com/developers/docs/resources/), in the notation of `.resource.actionName`, where `resource` is the name of a page on the sidebar, and `actionName` is the name of the header above each endpoint. This means the endpoint used above is ["Get Current User" on the "User" page](https://discordapp.com/developers/docs/resources/user#get-current-user).

## Installing

`@purplet/rest` has a peer-dependency on `discord-api-types` so we do not have to bump this package when types change slightly.

```sh
pnpm install @purplet/rest discord-api-types
# or
bun add @purplet/rest discord-api-types
```

## Polyfills

Until v18, node.js does not support `fetch`, and no version of node or bun has `FormData` built-in. We provide another package, `@purplet/polyfill` which polyfills these APIs for you:

```ts
import '@purplet/polyfill';
import { Rest } from '@purplet/rest';
// ...
```
