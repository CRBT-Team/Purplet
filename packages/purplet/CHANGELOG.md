# `purplet`

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
