# Purplet Fundamentals

## Hooks and Features

Purplet's core functions around a special object called a _feature_, which represents anything that contributes to your bot's functionality. In Purplet, features achieve action through "hooks", which are functions that return features, which _hook_ into the Discord API. Registering features is done by `export`ing them from any module inside of `src/features`. In development mode, Purplet watches your feature files for changes and is able to load your changes without restarting anything.

```ts title='src/features/slash-command.ts'
import { $slashCommand } from 'purplet';

export const helloWorld = $slashCommand({
  name: 'hello',
  description: 'A simple "Hello, World" command.',

  async handle() {
    this.showMessage('Hello, World!');
  },
});
```

:::note

We use "$" as a prefix for hooks, as the "$" symbol is valid in variable names, and isn't used anywhere else in this field of development. This allows us to have short function names that are easily understandable, as well as a potential ESLint plugin that checks to ensure you are correctly `export`ing feature objects.

:::

The naming of "hooks" was partially inspired off React, which encourages building custom hooks which wrap simpler hooks. Our internal library is built on 5 "core" hooks, and everything else is built on top of that base.

## Builder Classes

Purplet's documentation will show a lot of builder-style classes, but any place where one of these is used, you can pass a raw API object. This is because most of our APIs take a special type called `JSONResolvable<T>`, which allows passing in the desired value OR any builder so long as it contains a `toJSON` method. Meaning the two following are equivalent:

```ts
// Without builder, passing an APIEmbed
this.showMessage({
  title: 'Hello, World!',
  description: 'This is a message.',
});

// With a builder, since EmbedBuilder implements { toJSON(): APIEmbed }
this.showMessage(
  new EmbedBuilder() //
    .setTitle('Hello, World!')
    .setDescription('This is a message.')
);
```

:::tip Tip with code formatters

The `//` comment placed on the second line is only used to force Prettier to format the chained methods as separate lines.

:::
