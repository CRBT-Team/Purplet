# @purplet/rest

This is a JavaScript implementation for the Discord REST API. It is very light, and doesn't do more than is needed. We do not depend on any runtime-specific apis, but rather the `fetch` and `FormData` standard APIs, meaning this client can run in Node.js and in Bun (with polyfills). Every route is fully typed via [discord-api-types](https://github.com/discordjs/discord-api-types) and documented using auto-generated JSDoc comments from the [Discord API documentation](https://discordapp.com/developers/docs/resources).

Basic Example:

```ts
import { Rest } from '@purplet/rest';

const rest = new Rest({ token: process.env.token });

const me = await rest.user.getCurrentUser();
```

All routes are based off of the [Discord API Docs](https://discordapp.com/developers/docs/resources/), in the notation of `.resource.actionName`, where `resource` is the name of a page on the sidebar, and `actionName` is the name of the header above each endpoint. This means the endpoint used above is ["Get Current User" on the "User" page](https://discordapp.com/developers/docs/resources/user#get-current-user).

> note: "Receiving and Responding" is exposed as `interactionResponse`, as it is more concise

For requests with url params, JSON bodies, queries, file uploads, and the `X-Audit-Log-Reason` header; a consistent object is passed, though each route has a custom type generated to only allow the fields are allowed/required.

**Sending a Message:**

```ts
const result = await rest.channel.createMessage({
  // Url params are on the base object
  channelId: '995650617282412594',
  // JSON Body is `body`
  body: {
    content: 'Hello, world!',
    attachments: [
      {
        id: '0',
      },
    ],
  },
  // Attached files are `files`, you can pass a string, Uint8Array, or even `Bun.file(...)`
  files: [
    {
      name: 'cat.png',
      data: Bun.file('./cat.png'),
    },
  ],
});
```

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

## Missing/Incorrect Types

We generate most of our library's route metadata off of these GitHub repositories:

- [discord-api-docs](https://github.com/discord/discord-api-docs)
- [discord-api-types](https://github.com/discordjs/discord-api-types)

We do apply some patches of our own, but missing types should be contributed to the above repositories instead of as extra overrides to us. The following routes have buggy or incorrect types:

- Auto Moderation routes have not been merged yet. ([types#418](https://github.com/discordjs/discord-api-types/pull/418) / [purplet#35](https://github.com/CRBT-Team/Purplet/issues/35))

  - `autoModeration.listAutoModerationRulesForGuild`
  - `autoModeration.getAutoModerationRule`
  - `autoModeration.createAutoModerationRule`
  - `autoModeration.modifyAutoModerationRule`

- Some thread actions are missing. ([types#526](https://github.com/discordjs/discord-api-types/issues/526)) / [purplet#50](https://github.com/CRBT-Team/Purplet/issues/50))

  - `channel.listPublicArchivedThreads`
  - `channel.listPrivateArchivedThreads`
  - `channel.listJoinedPrivateArchivedThreads`
