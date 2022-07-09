# Contributing to Purplet

Purplet is open source under the [Apache 2.0 License](./LICENSE), and we welcome contributions. Before doing anything, please open an [issue][1] or talk about your ideas in [#purplet-general on Discord][2].

[1]: https://github.com/CRBT-Team/Purplet/issues
[2]: https://discord.gg/NFZqTWGVQ4

## Code Philiosophy and Structure

We believe the following principals when building Purplet:

- A handful of less lines for the developer is worth a hundred more of framework code.
- Developers should be given multiple ways to implement a given idea, but not infinite.
- Our APIs should be simple and composable. Any complex behavior should build off a simpler function (ex: `$slashCommand` is based off of `$command`, an internal hook that defines and provides a handler for a generic command).

Our code style is as follows:

- Use `pnpm` instead of `yarn` or `npm` (Our own code and examples. Developers may use whatever they want)
- Functions that return features must be named with a leading `$`.
- No more than two parameters + an "options" object per function.
- Files are named either as the exact name of a Class or hook (ex: `GatewayClient.ts`), or a description of what the file contains in kebab-case (ex: `errors.ts`). In some situations, the kebab-case name is written backwards to sort them with similar files (ex: the four `hook-*.ts` files).
- All files should be formatted with our [Prettier][3] config, which you can run with our `pnpm format`
- All changes should be documented with [Changesets][4]

## Commit Names

You may commit with whatever messages you want, but I (dave caruso) personally use a prefix followed by a short message. When pull requests are merged, commits will be squashed into one and committed using a prefix and the PR title, keeping the commit list clean no matter what.

My prefixes include but not limited to
- `feat:` when adding a feature
- `bugfix:` fixing a bug
- `docs:` writing and editing documentation, tsdoc or md
- `bump:` modifying dependencies (dependabot uses this)
- `tooling:` something related to our dev experience (adding or fixing a script)
- `chore:` doing a required task that isnt actually programming (setting up a new package)

## Structure of the Monorepo

- `examples/` contains our example projects. If an example has a `.template.json` file, it will show up in the `create-purplet` CLI.
- `packages/` contains our packages.
- `packages/purplet` contains the `purplet` package, where:
  - `./src/index.ts` is the library entry point.
  - `./src/builders` contains "Builder" style classes, which have `toJSON` methods to make building certain API structures easier
  - `./src/cli` contains the CLI and commands using it, including the implementation of `DevMode` and the build process.
  - `./src/config` contains configuration type definitions, validators, and defaults.
  - `./src/hooks` contains all built-in, non-core hooks
  - `./src/lib/` contains the main library, notable files include:
    - `hook-core.ts` defines the core hooks.
    - `GatewayBot.ts` and `HTTPBot.ts` implement the core hooks.
  - `./src/structures` contains all of our class wrappers around Discord API objects
  - `./src/utils` contains our utility functions
  - `./src/discord-api-types` re-exports the current api version of `discord-api-types` that we use.
- `sites` contains our websites, currently just `purplet.js.org`.
- `sites/purplet.js.org/docs` contains Purplet's documentation.

## Developer Tools

For Developers:

- `pnpm i` to install all workspace dependencies
- `pnpm dev` to start development mode for all packages and the documentation (port 3000)
- TODO: `pnpm global` install `purplet` and `create-purplet` globally for yourself. You can use them without further configuration in any other project.
- `pnpm changeset` to create a changeset
- `pnpm build` to build all packages
- `pnpm format` to run prettier across the entire monorepo
- `pnpm lint` to run eslint across the entire monorepo

For Maintainers:

- `pnpm bump` to apply changesets and bump packages
- `pnpm pub` to publish all packages

## Notes

- When the Discord API version changes, update the following files to fix `purplet/types`
  - `packages/purplet/global.d.ts`
  - `packages/purplet/src/types.ts`
