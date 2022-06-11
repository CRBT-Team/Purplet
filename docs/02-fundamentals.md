# Purplet Fundamentals

Purplet's core functions around a special object called a _feature_, which represents anything that contributes to your bot's functionality. In Purplet, features achieve action through a small set of hooks that let you tie into the running Discord.js client. Registering features is done by `export`ing them from any module inside of `src/features`. In development mode, Purplet watches your feature files for changes and is able to load your changes without restarting anything.

```ts title='src/features/example.ts'
import { createFeature } from 'purplet';

export default createFeature({
  name: 'Basic Feature',
  initialize() {
    console.log('Hello World');
  },
});
```

`createFeature` is intentionally extremely simple, consisting of only 7 "core hooks". More complex features, like registering and handling chat commands, are done in abstractions on top of `createFeature` called "custom hooks", such as the `$chatCommand` hook:

```ts title='src/features/command.ts'
import { $chatCommand } from 'purplet';

export const helloWorld = $chatCommand({
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

We use "$" as a prefix for custom hooks, as the "$" symbol is valid in variable names, and isn't used anywhere else in this context of development. This allows us to have short function names that are easily understandable, as well as a potential ESLint plugin that checks to ensure you are correctly `export`ing your features.

:::

The base `createFeature` API is described in depth [here](/docs/core-hooks), but you will almost always use the built-in custom hooks that the next pages of this documentation covers. However, understanding the simple underlying system Purplet will simplify the usage of the rest of the framework.
