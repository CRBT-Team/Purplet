# Configuration File

<!--
  The structure of this document is directly stolen from SvelteKit's docs
  https://kit.svelte.dev/docs/configuration
-->

Your project's configuration lives in a `purplet.config.ts` file. All values are optional. The complete list of options, with defaults, is shown here:

<!--
  Our config file default is automatically generated off of the following file:
  /packages/purplet/src/config/default.ts
-->

import { DefaultConfigCodeBlock } from '@site/src/components/DefaultConfigCodeBlock';

<DefaultConfigCodeBlock />

## `alias`

An object containing zero or more aliases used to replace values in import statements. These aliases are automatically passed to Vite and TypeScript. Built-in, `$lib` and `$features` aliases are provided.

For example, you can add aliases to a components and utils folder:

```ts title="svelte.config.ts"
const config = {
  alias: {
    $utils: 'src/utils',
  },
};
```

## `allowedMentions`

**[Not Implemented. See this GitHub issue](https://github.com/CRBT-Team/Purplet/issues/24)**

This sets a bot-wide default for the `allowed_mentions` field, passed to functions that send a message. By default, it is an object that only allows user mentions and replies to cause pings.

## `lang`

The primary language that your project is written in. This is only needed if you plan to translate your bot.

## `paths`

Defines various paths related to your application that Purplet uses:

- `build`: Path to where built JavaScript files are saved. The bot entry is always `index.js` inside of this folder.
- `features`: The directory to search and watch for exported `Feature` objects.
- `translations`: The directory that translation files are stored.

## `vite`

A Vite config object, or a function that returns one. You can pass Vite and Rollup plugins via the plugins option to customize your build in advanced ways.
