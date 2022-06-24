# Getting Started

import { InstallCodeBlock, RunScriptCodeBlock } from '@site/src/components/InstallCodeBlock';

:::danger Experimental Technology Ahead!

Purplet v2 is beta software. Proceed at your own risk, and please [report any issues you find on GitHub](https://github.com/CRBT-Team/Purplet/issues).

:::

These docs assume you have basic JavaScript/TypeScript, Discord.js, and general Discord API knowledge. If you lack that, you can follow the [nonexistant Tutorial For Absolute Beginners](#).

While you can install `purplet` directly, we recommend using a project template project provided via our `create-purplet` cli. It is also recommended to use [Pnpm](https://pnpm.io/) or [Yarn](https://yarnpkg.com/) as your package manager as they run faster than `npm`.

<InstallCodeBlock />

The default project is a simple bot with a "Hello world" command and an activity set, as well as sensible defaults for TypeScript, linting with ESLint, and formatting with Prettier.

To develop your bot, you first need a Discord Bot Token, obtained from the [Discord Developer Portal](https://discord.com/developers/applications), placed into a `.env` file:

```md
DISCORD_BOT_TOKEN=<token>
```

:::caution

Use separate bot accounts for development and production. Using the same token is an insecure practice, and Application Commands will desync when developing.

:::

You start Purplet's development mode with <RunScriptCodeBlock name='dev' />

## Package Scripts

The default template includes the following scripts, most of which are direct wrappers of the `purplet` CLI:

- **<RunScriptCodeBlock name='dev' />**: Starts a bot in development mode. Allows live-reloading. Deploys application commands only to individual servers for faster development.
- **<RunScriptCodeBlock name='build' />**: Compiles a Gateway client, for handling events as well as interactions.
- **<RunScriptCodeBlock name='build-http' />**: Builds an HTTP endpoint for handling interactions, allowing you to deploy interaction handlers as cloud functions. Not Implemented.
- **<RunScriptCodeBlock name='deploy' />**: Deploys all application commands globally, only usable after `build` or `build-http` has been run.
- **<RunScriptCodeBlock name='undeploy' />**: Deletes all global application commands, undoing the effects of `deploy`. This can be used if you accidentally deploy global commands on a development token.

## File Structure

- **`.env`**: Git-ignored file with environment variables, including bot and database tokens.
- **`purplet.config.ts`**: Contains [project configuration](/docs/configuration).
- **`.purplet/`**: Contains generated files by Purplet
- **`src/features/`**: Every `.js`/`.ts` file in this folder will be automatically scanned and loaded for [Features](/docs/fundamentals).
- **`src/lib/`**: Contains reusable code for your bot, importable by `$lib`. Not loaded automatically like the features folder is.
