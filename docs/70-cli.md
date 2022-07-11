# Command Line Interface
The Purplet CLI (Command Line Interface) is a tool that allows you to interact with Purplet in to test or build your bot, and more.

Each one of the commands is explained below, as well as the options that may be passed to the CLI.

## `dev`
Starts Purplet in development mode. The development mode uses Vite to allow for fast hot-reloading. To use it, the $DISCORD_BOT_TOKEN variable must be set to the token of a bot that is in few guilds, only intended for testing. Reloads will be slower with bots in over 5 guilds, and do not support bots in over 75 guilds.

## `build`
Builds a production gateway client to './dist', which can be run for an optimized production build without hot-reloading or server limits. Handles interactions unless you have an HTTP endpoint handled.

## `build-http`
Build a production HTTP interaction handler to './dist', which can be run for an optimized production build without hot-reloading or server limits. Handles interactions unless you have a gateway client handled.

## `deploy`
Manage production-deployed application commands, as the production gateway client or HTTP interaction handler do not do this for you. Pass `--delete` if you need to delete all commands.

Development mode will not run with global application commands, as it works with guild-based commands.

## `sync`
Generate development-related files, such as the generated tsconfig.json file. You don't usually need to run this as `purplet dev` will do this for you.

## `guild-manager`
Opens an interactive guild manager, which allows you to manage the bot's current guilds. This is useful if you run into issues with `purplet dev` complaining about the number of guilds your bot is in.

* The Guild Manager CLI has not been implemented yet.

## Options
There are also a few options that can be passed to the CLI.

### -V / --verbose
Shows debug logs. This option is off by default.

### -v / --version
Shows the Purplet version.

### -h / --help
Shows either the help menu, or help about a specific command. For example, `purplet -h dev` will show the help menu for the `dev` command.