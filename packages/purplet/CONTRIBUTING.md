# Contributing to `purplet`

**For full details, see the monorepo root [CONTRIBUTING.md](../../CONTRIBUTING.md).**

`purplet` is the largest package here, as it includes a CLI, dev server, build tools, and also hosts all the built-in hooks. We cannot split it up more than that since they all depend on each other.

## File Structure

- **`./global.d.ts`** contains global types.

- Entry points

  - **`./src/index.ts`** is the main library entry. `import 'purplet'`
  - **`./src/cli/_cli.ts`** is the CLI entry, such as `pnpm purplet dev`
  - **`./src/internal.ts`** is our internal library entry. We don't publish typedefs for this file, and it doesn't follow semver. `import 'purplet/internal'`
  - **`./src/types.ts`** re-exports all of `discord-api-types`. We do this because Purplet controls which version of the API we use, and ship types that we actually support. This also prevents users having big chores migrating to future Discord API version replacing every instance of `v10` with `v11` in their code.

- `src` has a few folders, here's the general orginization:

  - **`builders`** should be split off; Contains our builders.
  - **`cli`** contains our CLI and the commands it provides.
    - The `DevMode` class is placed here, which is what provides HMR.
  - **`config`** contains our config files.
    - `./config/default.ts` is what is used by the documentation site.
  - **`hooks`** contains our error classes.
  - **`lib`** contains library code.
  - **`structures`** should be split off; contains structures modelling the Discord API.
  - **`utils`** should be split off somewhat; Contains utility code.
