# Mention Commands

Mention commands. Since they are triggered by `@` mentions of the bot, the [Message Content Intent](https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Privileged-Intent-FAQ) is not required to use these.

:::warning

Consider using [Slash Commands](/docs/slash-commands) instead of these, as it provides better discoverability to users. These still make sense in the context of debugging or developer-only tools.

:::

```ts title='src/features/mention-command.ts'
import { $mentionCommand } from 'purplet';

export default $mentionCommand({
  name: 'ping',
  handle() {
    this.reply('Pong! 🏓');
  }
});
```

The object passed to `$slashCommand` is the `MentionCommandData` interface, which has these properties:

| Property | Description |
| --- | --- |
| `name` | The command name, may include any characters. |
| `args` | An array of regular expressions or `MentionCommandArgument` objects, see the arguments section. |
| `handle(...args)` | A function that is called when the command is run, with the triggering message bound to `this`. The arguments passed are the arguments defined by `args` |

## Arguments

Unlike [Slash Commands](/docs/slash-commands), mention commands use positional arguments, instead of named options. If `args` is not set, all arguments passed to the command will be passed to `handle`. Otherwise, message content will be matched against a defined regular expression, and then optionally transformed. In this mode, invalid arguments will cause the command not to run at all.

```ts title='Command without args array'
export default $mentionCommand({
  name: 'action',
  handle(name, rawNumber) {
    const number = parseInt(rawNumber, 10);
  },
});
```

```ts title='Command with args array'
export default $mentionCommand({
  name: 'action',
  args: [
    /[a-zA-Z]/,
    {
      match: /[0-9]+/,
      parse: match => parseInt(match[0]),
    },
  ],
  handle(name, number) {
    // name is a string, number is a number
  },
});
```

### Built-in argument matchers

Purplet provides a couple of `MentionCommandArgument` objects you can reuse for common purposes. They are exported as the `ArgTypes` object, which includes the following:

| Matcher        | Type      | Description                                                 |
| -------------- | --------- | ----------------------------------------------------------- |
| `string`       | `string`  | Matches any input.                                          |
| `alphanumeric` | `string`  | Matches any alphanumeric character.                         |
| `number`       | `number`  | Matches any number.                                         |
| `boolean`      | `boolean` | Matches `true`, `false`, `yes`, `no`, and other variations. |
| `integer`      | `number`  | Matches any integer number.                                 |
| `snowflake`    | `string`  | Matches any Discord snowflake.                              |
