# `purplet`

## 2.0.0-next.2

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

- Rewritten codebase, projects are bundled with vite and built with rollup. Instead of a Modules + Handlers api, it is based off of `Feature` objects.
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
