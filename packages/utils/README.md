# @purplet/utils

Helper functions, constants, builders, classes and more to assist Discord API driven development.

## Example

You can very easily add components to a message with no JSON required, and few boilerplate:

```ts
import { MessageComponentBuilder, createLinkButton } from '@purplet/utils';
import { $slashCommand } from 'purplet';

export default $slashCommand({
  name: 'socials',
  handle() {
    this.reply({
      content: 'Here are my socials!',
      components: new MessageComponentBuilder()
        .addInline(createLinkButton('Web', 'https://purplet.js.org'))
        .addInline(createLinkButton('Discord', 'https://discord.gg/C7fpBDJDtC')),
    });
  }
});
```

But there's more, a lot more in fact!

Discord URL routes, CDN URL formattings, Snowflakes to Dates, Markdown formatting for all mention types, JSON utilities, Regex... There's probably a few of these every Discord app developer could use!

## Installing

```sh
npm install @purplet/utils # or yarn/pnpm/bun add @purplet/utils.
```

`@purplet/utils` only depends on `discord-api-types`, which you don't have to install for it to work.

It operates independently from the Purplet framework or any other `@purplet` package, meaning you could also use these utilities in any other JavaScript project.

It also does not depend on Node.js or Bun APIs, so you can import it in a web environment.
