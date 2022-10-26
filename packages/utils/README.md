# @purplet/utils

This package contains a variety of utilities for interfacing with the Discord API, such as functions to format `@mentions`, parse snowflake IDs, builder classes to generate certain JSON structures, API constants, and more. It's designed to be useful to anyone interacting with the Discord API.

If you are using the [Purplet Framework](https://purplet.js.org), everything from this package is re-exported from the `purplet` import. Use that instead of installing this alongside your project.

## Installing

`@purplet/utils` has a peer-dependency on `discord-api-types` so we do not have to bump this package when types change slightly.

```sh
pnpm install @purplet/utils discord-api-types
# or
bun add @purplet/utils discord-api-types
```

## Features

Here is a subset of the utilities that are available in this package:

### Mention formatters

The following functions generate markdown mentions.

- `userMention(id or object)`
- `channelMention(id or object)`
- `roleMention(id or object)`
- `slashCommandMention(command object)`
- `emojiMention(emoji partial object)`
- `timestampMention(date, format?)`

```ts
const user = await rest.user.getCurrentUser();
console.log(`I'm ${userMention(user)}`); // I'm <@778616916092125206>
```

### Snowflakes

`snowflakeToDate` and `dateToSnowflake` allow conversion between snowflake IDs and dates.

### Builders and JSONResolvable

`JSONResolvable<T>` is a special type that allows a plain json object to contain builder classes to be placed anywhere within another interface, as `JSON.stringify` will call the `.toJSON` method on any classes that attempt to get stringified. In the example below, this is used with `APIMessage` to allow component helpers.

```ts
import { APIMessage } from 'discord-api-types/v10';
import { JSONResolvable, toJSONValue, MessageComponentBuilder, createLinkButton } from '@purplet/utils';
import { Rest } from '@purplet/rest';

const messageData: JSONResolvable<APIMessage> = {
  content: 'Here are my socials!',
  components: new MessageComponentBuilder()
    .addInline(createLinkButton('Web', 'https://purplet.js.org'))
    .addInline(createLinkButton('Discord', 'https://discord.gg/C7fpBDJDtC')),
};

messageData.components // a MessageComponentBuilder instance

// toJSONValue flattens the object without converting to a string.
// use `JSON.stringify` if you need a string value.
const rawMessage = toJSONValue(messageData);

messageData.components // an array of JSON objects.

const rest = new Rest({ token: '<token>' });
rest.channel.createMessage({
  channelId: '<channel>',
  // Most Purplet APIs accept JSONResolvable variants directly. The
  // manual step is only shown to illustrate the concept.
  body: rawMessage
});
```
