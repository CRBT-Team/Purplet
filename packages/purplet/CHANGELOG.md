# `purplet`

## 2.0.0-next.18

### Minor Changes

- feat: add `purplet/env` ([#55](https://github.com/CRBT-Team/Purplet/pull/55))

### Patch Changes

- fix: `$mentionCommand` now works ([#55](https://github.com/CRBT-Team/Purplet/pull/55))

- Updated dependencies
  [[`281b7dc`](https://github.com/CRBT-Team/Purplet/commit/281b7dcb853dea36ff0dbb8d129c44e21a5b10cb),
  [`8a57c60`](https://github.com/CRBT-Team/Purplet/commit/8a57c6051a5dd788536cbe924334d76aa4cd140f),
  [`8a57c60`](https://github.com/CRBT-Team/Purplet/commit/8a57c6051a5dd788536cbe924334d76aa4cd140f),
  [`bbbe1b1`](https://github.com/CRBT-Team/Purplet/commit/bbbe1b18de07dab0c4921a78f7b1ee6a1b63f293),
  [`e817d3d`](https://github.com/CRBT-Team/Purplet/commit/e817d3dc7a4fc5d019cae29d9a4eb5aff801fc13)]:
  - @purplet/rest@1.0.2-next.0

## 2.0.0-next.17

### Patch Changes

- move @davecode/types to be a required dependency
  ([`20b20d5`](https://github.com/CRBT-Team/Purplet/commit/20b20d564234091974bc0af18f1fe4d92152271c))

- Updated dependencies
  [[`20b20d5`](https://github.com/CRBT-Team/Purplet/commit/20b20d564234091974bc0af18f1fe4d92152271c)]:
  - @purplet/rest@1.0.1-next.0

## 2.0.0-next.16

### Patch Changes

- swap out `@discordjs/rest` with `@purplet/rest`
  ([#33](https://github.com/CRBT-Team/Purplet/pull/33))

* Extract `GatewayClient` to separate package `@purplet/gateway`
  ([#31](https://github.com/CRBT-Team/Purplet/pull/31))

* Updated dependencies
  [[`0ac1bdd`](https://github.com/CRBT-Team/Purplet/commit/0ac1bddf24f244207401d4e81b86e96fb649a3d1),
  [`1af5025`](https://github.com/CRBT-Team/Purplet/commit/1af5025c0e2db4689a7706ee8a669430e993f075)]:
  - @purplet/polyfill@1.0.1-next.0
  - @purplet/gateway@1.0.1-next.0

## 2.0.0-next.15

### Patch Changes

- OptionBuilder: fix string and number option types messing up

## 2.0.0-next.14

### Patch Changes

- component custom ids allow longer feature ids, making it more unlikely to get an error thrown
  during usage ([#22](https://github.com/CRBT-Team/Purplet/pull/22))

## 2.0.0-next.13

### Patch Changes

- add string option .maxLength and .minLength

## 2.0.0-next.12

Rebuild

## 2.0.0-next.11

### Patch Changes

- drop discord.js dependency, now has a custom gateway client
- rename `$onEvent` to `$gatewayEvent`
- fix an issue with subcommands and options not working
- fix autocomplete handlers
- fix a performance/nesting issue with OptionBuilder, causing it to fail with the infinite recursion
  error after four options
- support purplet.config.ts
- remove config.paths.temp
- Add Interaction.appPermissions
- stop exporting `$appCommand`. it is now an internal tool for us
- add error messages when startind dev mode
- add message attachments to Channel.createMessage, Interaction.showMessage,
  Interaction.updateMessage, and Message.edit
- add .meta property to all hooks, allowing user-defined metadata to be attached to hooks
- fix `purplet build`'s output to actually be runnable (due to changes in GatewayBot)
- new cli interface
- tweak the naming of some of the Bitfield classes to include the plural `s`

## 2.0.0-next.10

### Patch Changes

- Remove `djsClient` and `djsOption` hooks, and move all hooks to using purplet structures.
- Purplet structures are back. They aren't finalized and it's probably harder to use but yeah.
- Remove `$modal` temporarily. It will be back

- Updated dependencies
  [[`2a994ea`](https://github.com/CRBT-Team/Purplet/commit/2a994ea9e7e325cf5670f78477a621377c94c29e)]:
  - @purplet/serialize@2.0.0-next.0

## 2.0.0-next.9

### Patch Changes

- custom logger, which intercepts console.log
- add command groups
- fix intents hook not doing anything
- commands are deleted when dev process exits
- add config parsing
- mention commands have been modified significantly
- add getCustomId() onto components

## 2.0.0-next.8

### Patch Changes

- fix build

## 2.0.0-next.7

### Patch Changes

- fix build

## 2.0.0-next.6

### Patch Changes

- rename `$chatCommand` to `$slashCommand`
- add `$modal`
- revert to using discord.js structure for everything - the world isn't ready for what i have lol

- move `modules` to `features`
- Updated dependencies
  [[`38d20aa`](https://github.com/CRBT-Team/Purplet/commit/38d20aa5a4d4e12bac3e05008aac179b866118d3)]:
  - @purplet/serialize@1.0.0-next.0

## 2.0.0-next.5

### Patch Changes

<!-- these links are bad -->

- add `Message`, and partial helpers.
- add some basic interaction response functions.
- return an interaction message when you call `showMessage()`.
- add Bitfield classes.
- properly add all response functions.
- add full bitfield resolving.
- add basic autocomplete handler execution.
- add `$merge` and `$interaction`.
- add `MessageComponentBuilder` and `ModalComponentBuilder` for simplified creation of the
  `components` array..
- add component stuff.
- messed with the changelog format
-

## 2.0.0-next.4

### Patch Changes

- [`a4980c7`](https://github.com/CRBT-Team/Purplet/commit/a4980c741ea4d64bd74f13647840a4b85eb51aff):
  add hooks
  - `$appCommand`
  - `$userContextCommand`
  - `$djsUserContextCommand`
  - `$messageContextCommand`
  - `$djsMessageContextCommand`
- [`3b6d61d`](https://github.com/CRBT-Team/Purplet/commit/3b6d61d7f87f3a9d15c3693c2f3f8f23807eeeb7):
  add basic version of `$chatCommand`
- [`a4980c7`](https://github.com/CRBT-Team/Purplet/commit/a4980c741ea4d64bd74f13647840a4b85eb51aff):
  Add PurpletInteraction and all of it's subclasses.
- [`f16fdc3`](https://github.com/CRBT-Team/Purplet/commit/f16fdc3ee675e08eddc5bae352994b0ac913fd9f):
  Fix OptionBuilder types
- [`a4980c7`](https://github.com/CRBT-Team/Purplet/commit/a4980c741ea4d64bd74f13647840a4b85eb51aff):
  add OptionBuilder

## 2.0.0-next.3

### Patch Changes

- 16cc280: - add `$onDJSEvent`, a wrapper around `djsClient` hook with `.on(event)`
  - add `$intents`, shorthand for the `intents` hook
  - add `$service`, a wrapper around the `initialize` hook
  - add `$djsOptions`, shorthand for the `djsOptions` hook
  - add `$presence`, a one liner on top of `$djsOptions` for presence data
- 1360e42: breaking: simplify built in hook apis
  - `initialize` -> no args
  - `djsClient` -> client first arg
  - `djsOptions` -> prev options first arg
  - `interaction` -> the interaction
  - `applicationCommands` -> no args
  - `intents` -> no args
- c840aae: fix framework breaking when it is rebuilt while also running
- 31c8390: add `@discordjs/rest` client under the `rest` import
- 0cb148c: add `applicationCommands` hook
- ebc53d4: add custom hook `$onRawEvent`

## 2.0.0-next.1

### Patch Changes

- Rewritten codebase, projects are bundled with vite and built with rollup. Instead of a Modules +
  Handlers api, it is based off of `Feature` objects.
- Removed purplet configuration file.
- Removed every handler type, but all of these will be added in some variation.

## 1.3.1

### Changes

- Reverse `required` to default to false

## 1.3.0

### Changes

- Added ModalComponent and bumped D.js to v13.7.
- Improved README.md.
- `create-purplet` package to initialize a new Purplet project.
- Added support for attachments in OptionBuilder

## 1.2.8

### Changes

- Changed OptionBuilder to use an option object for extra properties.

## 1.0.4

### Changes

- Fix: mentionable options resolving in a snowflake instead of the option object
- Added handler for text commands (`TextCommandHandler()`)

## 1.0.3

### Changes

- Fix: `build-dev.mjs`:
  - Using a `fs-extra` function with `fs` only
  - `JSON.stringify`ed the `package.json` to send over to the build.
- Added nicer and more accurate build messages.

## 1.0.2

### Changes

- ChatCommand: make `options` optional.

## 1.0.1

### Changes

- Bug fix: building a bot with more than one module fails
- Removed handlers folder

## 1.0.0

### Changes

Initial release. Very basic, no development mode
