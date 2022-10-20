# @purplet/utils

This package contains a variety of utility functions for interfacing with the Discord API, such as functions to format `@mentions`, parse snowflake IDs, as well as tools to generate certain JSON structures for sending to the API. There are also a some non-discord specific utilities that are useful in the context of developing a bot.

If you're looking to build a full bot or send HTTP requests to Discord, check out the [Purplet Framework](https://purplet.js.org) or [@purplet/rest](https://npmjs.com/@purplet/rest), respectivly.

## Installing

`@purplet/utils` has a peer-dependency on `discord-api-types` so we do not have to bump this package when types change slightly.

```sh
pnpm install @purplet/utils discord-api-types
# or
bun add @purplet/utils discord-api-types
```
