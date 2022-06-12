# Configuration File

<!--
  The structure of this document is directly stolen from SvelteKit's docs
  https://kit.svelte.dev/docs/configuration
-->

Your project's configuration lives in a `purplet.config.ts` file. All values are optional. The complete list of options, with defaults, is shown here:

<!-- See ./04-default-config.ts for the actual config. The `.js` variant of it is generated automatically. -->

import { DefaultConfigCodeBlock } from '@site/src/components/DefaultConfigCodeBlock';

<DefaultConfigCodeBlock />

## `alias`

An object containing zero or more aliases used to replace values in import statements. These aliases are automatically passed to Vite and TypeScript.

For example, you can add aliases to a components and utils folder:

```ts title="svelte.config.ts"
const config = {
  alias: {
    $utils: 'src/utils'
  }
};
```

## `paths`

Defines various paths related to your application and the Purplet Core and CLI:

- `build`: Path to where built JavaScript files are saved. The bot entry is always `index.js` inside of this folder.
- `features`: The directory to search and watch for exported `Feature` objects.
- `output`: A temporary folder that Purplet uses for building and generated types.
- `translations`: Unused.

## `vite`

A Vite config object, or a function that returns one. You can pass Vite and Rollup plugins via the plugins option to customize your build in advanced ways.