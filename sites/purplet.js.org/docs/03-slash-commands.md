# Slash Commands

[Slash Commands](https://discord.com/developers/docs/interactions/application-commands#slash-commands), aka Application Commands with the type `CHAT_INPUT`, is the most common way of interacting with a Discord bot, accessed by typing `/` in a text channel.

The Discord API separates commands into two parts, registering a command via the API, then receiving and responding to the interactions. Purplet combines these two functions into one function call, which handles both parts of the command. This coupling of commands creates simpler command definitions and strong typing of the options.

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

The object passed to `$slashCommand` is the `SlashCommandData` interface, which has these properties:

| Property | Description |
| --- | --- |
| `name` | [1-32 character name](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-naming) |
| `description` | 1-100 character description |
| `options?` | An [`OptionBuilder`](#command-options) containing a list of command options. |
| `handle(args)` | A function that is called when the command is run. The first argument given is an object mapping option names to option values, which is fully typed off of the `options` property. |
| `permissions?` | Required permissions to use this command, unless overridden by a server admin, see [Permissions](#permissions). Defaults to [] |
| `allowInDM?` | If `false`, disallow this command in direct messages, see [Permissions](#permissions). |

## Command Options

The `options` parameter takes an instance of an `OptionBuilder`, which makes it quick to define a list of command options. Each option type has a method corresponding to it, taking in 2-3 parameters, and can be chained to add multiple options:

```ts
export default $slashCommand({
  name: 'schedule-message',
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

For more detail on the functionality of these properties, with the exception of `choices` and `autocomplete`, see [this page on the Discord API Docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) as our API mirrors it except for using camel case property names. Subcommand and Subcommand Group types are missing here as they are fulfilled by [Command Groups](#subcommands).

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

Instead of passing a boolean to `autocomplete`, an async function is passed, which is used as the autocomplete handler. It is passed a single object of the user's current **unresolved** options. Remember that users can fill out command options in any order, and the interaction is sent out for an empty value to get the initial set of choices, so all properties given may be undefined. Unlike `choices`, you must return an array of [Choice objects](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-choice-structure).

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

## Permissions

Command permissions are configurable by server admins, but bots are allowed to change their default permissions. The `permissions` property takes anything that can resolve to a permission string, including strings of permission names, bigints, or `BitField` objects. Bots can also control commands being able to be used in Direct Messages via the `allowInDM` property, which defaults to `true`.

A list of permission strings can be found [here](https://github.com/discordjs/discord-api-types/blob/main/payloads/common.ts#L10). Here is an example of a command that requires a server member with "Manage Roles":

```ts
export default $slashCommand({
  name: 'role-related-command',
  description: '...',
  options: new OptionBuilder(),
  permissions: ['ManageRoles'],
  allowInDM: false,
  handle(options) {
    // ...
  },
});
```

:::note

This does not affect the TS type of the interaction passed to `handle`. In the future, this will be modified to give a stronger `Interaction` type, such as making `.member` not optional if you set `allowInDM` to `false` since that property will always exist.

:::

## Subcommands

Natively, subcommands are represented as the `SUB_COMMAND` and `SUB_COMMAND_GROUP` option types. [Refer to the Discord API Docs to learn how commands are usually structured](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups), as Purplet takes a different approach.

In Purplet, Subcommands are defined by putting a space in the command's `name`, then defining a separate `$slashCommandGroup` feature to contain metadata about the group.

```ts
export const play = $slashCommand({
  name: 'music play',
  description: 'Play a track by name.',
  // ...
});

export const stop = $slashCommand({
  name: 'music stop',
  description: 'Stop the music player.',
  // ...
});

export const skip = $slashCommand({
  name: 'music skip',
  description: 'Skip the current track.',
  // ...
});

export default $slashCommandGroup({
  name: 'music',
  description: 'Play and manage the Music Player.',
});
```

Under the hood, these features are merged into one, and a single Application Command is deployed, and interactions are routed to the individual `$slashCommand` `handle()` functions. **Command groups are required for subcommands, as descriptions are mandatory**.

The object passed to `$slashCommandGroup` is the `SlashCommandGroup` object, which has these properties:

| Property | Description |
| --- | --- |
| `name` | [1-32 character name](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-naming) |
| `description` | 1-100 character description |
| `permissions?` | Required permissions to use this command, unless overridden by a server admin, see [Permissions](#permissions). Defaults to [] |
| `allowInDM?` | If `false`, disallow this command in direct messages, see [Permissions](#permissions). |

### Tips

- For large commands, you can split the individual exports across multiple files, since `Feature` objects are collected into a project-wide list, then Command Groups are resolved.
- If multiple subcommands use the same set of options, you can define the `OptionBuilder` in as a separate variable, then pass the same builder to each subcommand.

### Caveats

- Permissions are only supported on the top-level Command Group, meaning subcommands may not have alternate permissions. The `permissions` and `allowInDM` properties of subcommands are ignored.

## Deploying Commands

Commands are not automatically deployed in production, please read Building for Production.
