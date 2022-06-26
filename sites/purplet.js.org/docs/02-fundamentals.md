# Purplet Fundamentals

Purplet's core functions around a special object called a _feature_, which represents anything that contributes to your bot's functionality. In Purplet, features achieve action through "hooks", which are functions that return features, which _hook_ into the running Discord.js client. Registering features is done by `export`ing them from any module inside of `src/features`. In development mode, Purplet watches your feature files for changes and is able to load your changes without restarting anything.

```ts title='src/features/slash-command.ts'
import { $slashCommand } from 'purplet';

export const helloWorld = $slashCommand({
  name: 'hello',
  description: 'A simple "Hello, World" command.',

  async handle() {
    this.reply({
      content: 'Hello, World!',
    });
  },
});
```

:::note

We use "$" as a prefix for hooks, as the "$" symbol is valid in variable names, and isn't used anywhere else in this field of development. This allows us to have short function names that are easily understandable, as well as a potential ESLint plugin that checks to ensure you are correctly `export`ing feature objects.

:::

The naming of "hooks" was partially inspired off React, which encourages building custom hooks which wrap simpler hooks. Our internal library is built on 5 "core" hooks, and everything else is built on top of that base.
