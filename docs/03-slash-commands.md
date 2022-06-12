# Slash Commands

[Slash Commands](https://discord.com/developers/docs/interactions/application-commands#slash-commands), aka Application Commands with type `CHAT_INPUT`, are the most common way of interacting with a Discord bot, accessed by typing `/` in a text channel.

The Discord API separates commands into two parts, registering a command via the API, then receiving and responding to the interactions. Purplet combines these two functions into one function call, which handles both parts of the command. This coupling of commands creates simpler command definitions, and strong typing of the options.

Here is a simple "Hello World" command, it's the same one you've seen on the homepage and previous documentation page, but it also defines some options:

```ts title='src/features/slash-command.ts'
import { $slashCommand, OptionBuilder } from 'purplet';

export default $slashCommand({
  name: 'hello',
  description: 'A simple "Hello, World" command.',
  options: new OptionBuilder() //
    .string('name', 'Name to say hello to.'),
  async handle({ name }) {
    this.reply({
      content: `Hello, ${name ?? 'World'}!`,
    });
  },
});
```

The object passed to `$slashCommand` is the `ChatCommandData` interface, which has these properties.

| Property | Description |
| --- | --- |
| `name` | [1-32 character name][cmd-naming] |
| `description` | 1-100 character description |
| `options?` | An [`OptionBuilder`](#command-options) containing a list of command options. |
| `handle(args)` | A function that is called when the command is run. The first argument given is an object mapping option names to option values, which is fully typed off of the `options` property. |

## Command Options

The `options` paramter takes an instance of an `OptionBuilder`, which makes it quick to define a list of command options. Each option type has a method corresponding to it, taking in 2-3 parameters, and can be chained to add multiple options:

```ts
export default $slashCommand({
  name: 'schedule_message',
  description: 'Sends a message with the specified text with a delay.',
  options: new OptionBuilder() //
    .string('text', 'Text to send.', { required: true })
    .number('hours', 'Number of hours to wait before sending the message', {
      required: true,
      minValue: 0.5,
      maxValue: 24,
    }),
    .channel('channel', 'Where to send the message. Defaults to the current channel.')
    .boolean('bold', 'If enabled, the message will be placed in bold.'),
  async handle(options) {
    /*
      `options` is of type
      { text: string, hours: number, channel?: Channel, bold?: boolean }
    */
  },
});
```

:::tip

If you are using Prettier, you can use a blank `//` comment to force the chained methods of any builder to wrap to the next line, as seen above.

:::

The third parameter is an "options for the option" object. Here is a full list of the methods and their extra parameters, which are all optional:

| Method        | Allowed Properties                                            |
| ------------- | ------------------------------------------------------------- |
| `string`      | `required`, `autocomplete`, `choices`                         |
| `integer`     | `required`, `autocomplete`, `choices`, `minValue`, `maxValue` |
| `boolean`     | `required`                                                    |
| `channel`     | `required`, `channelTypes`                                    |
| `user`        | `required`                                                    |
| `mentionable` | `required`                                                    |
| `role`        | `required`                                                    |
| `number`      | `required`, `autocomplete`, `choices`, `minValue`, `maxValue` |
| `attachment`  | `required`                                                    |

For more detail on the functionality of these properties, with the exception of `choices` and `autocomplete`, see the [this page on the Discord API Docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) as our api mirrors it except for using camel case property names.

### Options with Choices

The `choices` property was altered to allow for more concise definitions. Instead of an array of objects, it is a single object mapping keys to display names.

```ts
new OptionBuilder() //
  .string('move', 'The move you would like to make.', {
    required: true,
    choices: {
      rock: 'Rock',
      paper: 'Paper',
      scissors: 'Scissors',
    },
  });
```

:::tip TypeScript Tip

The type passed to `handle()` will be a union of the choice object keys. In this example, that would be `"rock" | "paper" | "scissors"`.

:::

### Autocomplete

Instead of passing a boolean to `autocomplete`, an async function is passed, which is used as the autocomplete handler. It is passed a single object of the user's current **unresolved** options. Remember that users can fill out command options in any order, and the interaction is sent out for an empty value to get the initial set of choices, so all properties given may be undefined. Unlike `choices`, you must return an array of [Choice objects][choice-object].

```ts
new OptionBuilder() //
  .string('pokemon', 'The pokemon would you like to get information on', {
    required: true,
    async autocomplete({ pokemon }) {
      // `pokemon` is either `undefined` or the partial text the user has.
      const results = await searchPokemon(pokemon ?? '');

      return results.map(item => ({ name: item.name, value: item.id }));
    },
  });
```

:::note

An option cannot specify both `autocomplete` and `choices`.

:::

## Subcommands

Not supported currently, check back later...

## Notes

- **_TODO_**: invent the way you deploy commands in development.
- In production, there is a separate command used to deploy Application Commands. See Building for Production for more details.

<!-- Links -->

[cmd-naming]: https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-naming
[choice-object]: https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-choice-structure
