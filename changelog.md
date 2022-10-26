## 1.4.0

### **BREAKING CHANGES**

The following changes were made to allow for a smoother transition to Purplet 2, which is coming (eventually). While the features both versions offer vary and the way they operate is different, bringing Purplet 1 closer to the newer coming version is going to help smooth the transition out.

- Renamed 'modules' to 'features' everywhere, meaning the default directory is now at `src/features`
- Renamed all handlers to the dollar sign 'hook naming' used in Purplet 2:

| Purplet 1.3.X                        | Purplet 1.4.X (and Purplet 2)            |
| ------------------------------------ | ---------------------------------------- |
| `ChatCommand`                        | `$slashCommand`                          |
| `MessageContextCommand`              | `$messageContextCommand`                 |
| `UserContextCommand`                 | `$userContextCommand`                    |
| `ButtonComponent`                    | `$button`                                |
| `SelectMenuComponent`                | `$selectMenu`                            |
| `ModalComponent`                     | `$modal`                                 |
| `TextCommand`                        | `$mentionCommand`                        |
| `Service`                            | `$service`                               |
| `OnEvent`                            | `$gatewayEvent`                          |
| `defineConfig` (`purplet.config.ts`) | `$config` (this works differently in v2) |

> Note: While the naming is now consistent with the upcoming Purplet 2, the features and core functionality can be different.

- `getRest()` now returns a `@purplet/rest` `Rest` instance instead of the previous `@discordjs/rest` `REST`
- `TextCommand` is now `$mentionCommand`:
  - The `prefix` option was removed from the handler config object.
  - A Mention Command is now invoked with a mention to your bot as the prefix (e.g. `@CRBT command`).
  - This change was made because Discord is moving away from old bot commands, and as Purplet was never intended to really support them, it should not affect developers too much.
- The `Config` option `commandGuilds` was removed in favor of the `PURPLET_INCLUDE_GUILDS` environment variable

  `purplet.config.ts`

  ```diff
  - const config = $config({
  -   discord: {
  -     commandGuilds: [
  -       '123', '456', '789'
  -     ]
  -   }
  - });
  ```

  `.env`

  ```diff
  + PURPLET_INCLUDE_GUILDS = "123,456,789"
  ```

### Other

- `purplet` re-exports everything from `@purplet/utils`
- Bumped Discord.js to `v13.11.0`

## 1.3.3

- Backports `nameLocalizations`, `descriptionLocalizations` and `allowInDMs` props to `ChatCommand`
- Backports `minLength` & `maxLength` options to `OptionBuilder#string()`
- Bumped D.js to v13.9

## 1.3.1

- Reverse `required` to default to false

## 1.3.0

- Added ModalComponent and bumped D.js to v13.7.
- Improved README.md.
- `create-purplet` package to initialize a new Purplet project.
- Added support for attachments in OptionBuilder

## 1.2.8

- Changed OptionBuilder to use an option object for extra properties.

## 1.0.4

- Fix: mentionable options resolving in a snowflake instead of the option object
- Added handler for text commands (`TextCommandHandler()`)

## 1.0.3

- Fix: `build-dev.mjs`:
  - Using a `fs-extra` function with `fs` only
  - `JSON.stringify`ed the `package.json` to send over to the build.
- Added nicer and more accurate build messages.

## 1.0.2

- ChatCommand: make `options` optional.

## 1.0.1

- Bug fix: building a bot with more than one module fails
- Removed handlers folder

## 1.0.0

Initial release. Very basic, no development mode
