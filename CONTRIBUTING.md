# Contributing to Purplet

Purplet is open source under the [Apache 2.0 License](./LICENSE), and we welcome contributions. Before doing anything, please open an [issue][1] or talk about your ideas in [#purplet-general on Discord][2].

## Code Philiosophy and Structure

We believe the following principals when building Purplet:

- A handful of less lines for the developer is worth a hundred more of framework code.
- Developers should be given multiple ways to implement a given idea, but not infinite.
- Our APIs should be simple and composable. Any complex behavior should build off a simpler function (ex: `$slashCommand` is based off of `$command`, an internal hook that defines and provides a handler for a generic command).

Our code style is as follows:

- Use `pnpm` instead of `yarn` or `npm` (Our own code and examples. Developers may use whatever they want)
- Functions that return features must be named with a leading `$`.
- No more than two parameters + an "options" object per function.
- All files should be formatted with our [Prettier][3] config, which you can run with our `pnpm format`
- All changes should be documented with [Changesets][4]

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
