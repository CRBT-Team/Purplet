# Purplet Fundamentals

Purplet's core functions around a special object called a _feature_, which adds some functionality to your Discord bot. Registering features is done by `export`ing them from your modules. This lets Purplet easily hot-reload your changes without having to restart the entire bot.

```ts
import { createFeature } from 'purplet';

export default createFeature({
  name: 'Basic Feature',
  initialize() {
    console.log('Hello World');
  },
});
```

To keep the core as simple as possible, the api of `createFeature` is extremely basic, and you should instead use the various feature functions, which all start with a `$`. These feature functions are built-in abstractions on top of the core that make it trivial to add things such as slash commands:

```ts
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

We use `$` as a prefix for feature functions, as the symbol is valid in variable names, and isn't used anywhere else in this context of development. It allows us to have short function names that are understandable, as well as an ESLint plugin that checks to ensure you are correctly `export`ing your features.

## Current Feature Functions

TODO:
