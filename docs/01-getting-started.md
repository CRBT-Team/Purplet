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

Use separate bot accounts for development and production. This is important as Application Commands may get cleared from your production bot, and interactions may get routed incorrectly if you are running both at once.

:::

To make reloads faster, Purplet only registers to commands to guilds that you specify. This is done through the `UNSTABLE_PURPLET_COMMAND_GUILDS` environment variable, which is a comma separated list of Guild Ids: (TODO: THIS FEATURE WILL CHANGE FOR A BETTER SYSTEM AS I DO RESEARCH)

```
UNSTABLE_PURPLET_COMMAND_GUILDS=516410163230539837,782584672298729473
```

You then start development mode with <RunScriptCodeBlock name='dev' />

## Package Scripts

- **<RunScriptCodeBlock name='dev' />**: Starts a bot in development mode. Allows live-reloading. Deploys application commands only to specified servers to ensure they are instantly usable.
- **<RunScriptCodeBlock name='build' />**: Builds a compiled `.js` file with the bot, running application commands globally.

## File Structure

- **`.env`**: Git-ignored file with environment variables, including bot and database tokens.
- **`purplet.config.ts`**: Contains [project configuration](/docs/configuration).
- **`.purplet/`**: Contains generated files by Purplet
- **`src/features/`**: Every `.js`/`.ts` file in this folder will be automatically scanned and loaded for [Features](/docs/fundamentals).
- **`src/lib/`**: Contains reusable code for your bot, importable by `$lib`. Not loaded automatically like the features folder is.