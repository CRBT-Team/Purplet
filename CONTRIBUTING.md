# Contributing to Purplet

Purplet is open source under the [Apache 2.0 License](./LICENSE), and we welcome contributions. Before doing anything, please open an [issue][1] or talk about your ideas in [#purplet-dev on Discord][2].

[1]: https://github.com/CRBT-Team/Purplet/issues
[2]: https://discord.gg/C7fpBDJDtC

## Code Philiosophy and Style

We believe the following principals when building Purplet:

- Speed is important to us, but it isn't the top priority; typedefs and developer experience are. This does **not** mean we can forget about performance for the means of DX.
- A handful of less lines for the developer is worth a hundred more of framework code.
- Developers should be given multiple ways to implement a given idea, but not infinite.
- Our APIs should be simple and composable. Any complex behavior should build off a simpler function (ex: `$slashCommand` is based off of `$command`, an internal hook that defines and provides a handler for a generic command).
- There should not be one centeral package, but instead split into smaller, reusable APIs, such as `@purplet/rest`.

Our code style is as follows:

- Use `pnpm` instead of `yarn` or `npm` (Our own code and examples. Developers may use whatever they want)
- I follow [Conventional Commits](https://conventionalcommits.org/) when naming commits. You don't have to, but it is a very nice system.
- Functions that return Purplet `Feature`s must be named with a leading `$`.
- No more than two parameters + an "options" object per function.
- Files are named either as the exact name of a Class definition (ex: `GatewayClient.ts`), or a description of what the file contains in kebab-case (ex: `errors.ts`). In some situations, the kebab-case name is written backwards to sort them with similar files (ex: the four `hook-*.ts` files).
- All files should be formatted with our [Prettier][3] config, which you can run with our `pnpm format`
- All changes should be documented with [Changesets][4]

[3]: https://prettier.io/
[4]: https://github.com/changesets/changesets

## Structure of the Monorepo

- `examples/` contains our example projects. If an example has a `.template.json` file, it will show up in the `create-purplet` CLI.
- `packages/` contains our packages.
  - each package has a `CONTRIBUTING.md` with package-specific information.
- `sites` contains our websites, currently just `purplet.js.org`.
- `sites/purplet.js.org/docs` contains Purplet's documentation.

## Tools and Commands

**For Developers:**

- `pnpm i` to install all workspace dependencies
- `pnpm dev` to start development mode for all packages and the documentation (port 3000)
- `pnpm changeset` to create a changeset
- `pnpm build` to build all packages
- `pnpm format` to run prettier across the entire monorepo
- `pnpm lint` to run eslint across the entire monorepo

**For Maintainers:**

- `pnpm bump` to apply changesets and bump packages
- `pnpm pub` to publish all packages
