import {
  ApplicationCommandData,
  ChatInputApplicationCommandData,
  Client,
  CommandInteraction,
  CommandInteractionOption,
  Guild,
  Interaction,
} from 'discord.js';
import { createInstance, Handler } from '../Handler';
import {
  Autocomplete,
  getAutoCompleteHandlersFromBuilder,
  getOptionsFromBuilder,
  GetOptionsFromBuilder,
  IOptionBuilder,
} from '../util/OptionBuilder';

export interface ChatCommandData<O extends IOptionBuilder = IOptionBuilder> {
  /**
   * The name of the command, not including the "/" character. You can include spaces to create
   * subcommands and subcommand groups, and Purplet will automatically combine commands for you.
   */
  name: string;
  /** The description of the command. This will be shown under the command name in Discord */
  description: string;
  /** The options for the command. Pass an instance of OptionBuilder to create a command with options. */
  options?: O;
  /**
   * The function to execute when the command is called. The interaction is bound to `this` and the
   * resolved options are passed as the first argument.
   */
  handle: (this: CommandInteraction, options: GetOptionsFromBuilder<O>) => void;
}

export interface ChatCommandGroupData {
  /** The name of the command group, not including the "/" character. */
  name: string;
  /**
   * The description of the command group. This *should* be shown under the command group name in
   * Discord, but doesn't go anywhere as of right now.
   */
  description: string;
}

/**
 * An internal type containing the user-provided data but some extra metadata. This could be done a
 * nicer way, but it's done like this to allow the same handler taking in two data types.
 */
type ChatCommandHandlerData =
  | {
      type: 'command';
      data: ChatCommandData;
      autocompleteData: Record<string, Autocomplete<unknown, unknown>>;
    }
  | { type: 'group'; data: ChatCommandGroupData };

/** Helper function for resolving a CommandInteractionOption to it's actual value (users and roles) */
async function resolveOptionValue(
  client: Client,
  guild: Guild | null,
  opt: CommandInteractionOption
) {
  const value = opt.value;
  if (typeof value === 'string') {
    switch (opt.type) {
      case 'CHANNEL':
        return client.channels.resolve(value);
      case 'USER':
        return client.users.resolve(value);
      case 'ROLE':
        return guild?.roles.resolve(value);
      case 'MENTIONABLE':
        return client.users.resolve(value) || guild?.roles.resolve(value);
      default:
        return opt.value;
    }
  }
  return opt.value;
}

/**
 * Handler for registering and responding to CHAT_INPUT Application Commands, aka "Slash Commands",
 * see ChatCommand() for creating handler modules.
 */
export class ChatCommandHandler extends Handler<ChatCommandHandlerData> {
  commands = new Map<string, ChatCommandHandlerData>();

  handleInteraction = async (interaction: Interaction) => {
    // Two interaction types are listened for: command executions and autocomplete requests.
    // These are handled very similarly, so a lot of the logic is shared.
    if (!interaction.isCommand() && !interaction.isAutocomplete()) return;

    // Get the full command name and it's module
    const name = [
      interaction.commandName,
      interaction.options.getSubcommandGroup(false),
      interaction.options.getSubcommand(false),
    ]
      .filter(Boolean)
      .join(' ');

    const module = this.commands.get(name);
    if (!module || module.type !== 'command') return;

    // when subcommands are used, options contain stuff like { name: "<subcommand>", options: [] }
    // these must be flattened to get the real options
    const flattenedOptions = interaction.options.data
      .flatMap((x) => (x.type === 'SUB_COMMAND_GROUP' ? x.options ?? [] : [x]))
      .flatMap((x) => (x.type === 'SUB_COMMAND' ? x.options ?? [] : [x]));

    if (interaction.isCommand()) {
      // option partials may be useful, but for DX reasons they are always automatically resolved
      const resolvedOptions = Object.fromEntries(
        await Promise.all(
          flattenedOptions.map(async (opt) => [
            opt.name,
            await resolveOptionValue(this.client, interaction.guild, opt),
          ])
        )
      );

      module.data.handle.call(interaction, resolvedOptions);
    } else {
      // for autocomplete, we do not *fully* resolve the options
      const resolvedOptions = Object.fromEntries(
        await Promise.all(flattenedOptions.map(async (opt) => [opt.name, opt.value]))
      );

      const focused = flattenedOptions.find((x) => x.focused);
      const handler = module.autocompleteData[focused!.name];
      const choices = await handler(resolvedOptions);

      // discord limits to 25 choices max, so we will limit the choices to that in case the dev forgot
      interaction.respond(choices.slice(0, 25));
    }
  };

  setup() {
    this.client.on('interactionCreate', this.handleInteraction);
  }

  cleanup() {
    this.client.off('interactionCreate', this.handleInteraction);
  }

  register(id: string, instance: ChatCommandHandlerData) {
    if (this.commands.has(instance.data.name)) {
      // If register() throws, the framework will handle this and print
      // a nice message about a duplicate handler instance.
      throw new Error(`Command ${instance.data.name} already exists`);
    }
    this.commands.set(instance.data.name, instance);
  }

  unregister(id: string, instance: ChatCommandHandlerData) {
    this.commands.delete(instance.data.name);
  }

  getApplicationCommands(): ApplicationCommandData[] {
    // TODO: clean up and explain how this works (it assembles a list of discord cmd objs)
    const commandsParts: Record<string, ChatCommandHandlerData[]> = {};

    for (const [name, data] of this.commands) {
      const cmdName = name.split(' ')[0];
      if (!commandsParts[cmdName]) commandsParts[cmdName] = [];
      commandsParts[cmdName].push(data);
    }

    return Object.values(commandsParts).map((subcommands) => {
      const discordCommand = {
        type: 'CHAT_INPUT',
        name: subcommands[0].data.name.split(' ')[0],
        description: 'No Description Provided',
        options: [],
      } as ChatInputApplicationCommandData;

      for (const subcommand of subcommands) {
        const splitName = subcommand.data.name.split(' ');
        if (subcommand.type === 'command') {
          if (splitName.length === 1) {
            discordCommand.description = subcommand.data.description;
            discordCommand.options = getOptionsFromBuilder(subcommand.data.options);
            return discordCommand;
          } else if (splitName.length === 2) {
            discordCommand.options!.push({
              type: 'SUB_COMMAND',
              name: splitName[1],
              description: subcommand.data.description,
              options: getOptionsFromBuilder(subcommand.data.options) as any,
            });
          } else if (splitName.length === 3) {
            let option = discordCommand.options!.find((opt) => opt.name === splitName[1]) as any;

            if (!option) {
              option = {
                type: 'SUB_COMMAND_GROUP',
                description: 'No Description Provided',
                name: splitName[1],
                options: [],
              };

              discordCommand.options!.push(option);
            }

            option.options!.push({
              type: 'SUB_COMMAND',
              name: splitName[2],
              description: subcommand.data.description,
              options: getOptionsFromBuilder(subcommand.data.options),
            });
          } else {
            throw new Error(`Invalid command name: ${subcommand.data.name} (too many spaces)`);
          }
        } else {
          if (splitName.length === 1) {
            discordCommand.description = subcommand.data.description;
          } else if (splitName.length === 2) {
            let option = discordCommand.options!.find((opt) => opt.name === splitName[1]) as any;

            if (!option) {
              option = {
                type: 'SUB_COMMAND_GROUP',
                description: '',
                name: splitName[1],
                options: [],
              };

              discordCommand.options!.push(option);
            }

            option.description = subcommand.data.description;
          } else {
            throw new Error(
              `Invalid command group name: ${subcommand.data.name} (too many spaces)`
            );
          }
        }
      }

      return discordCommand;
    });

    // return [...this.commands.values()].map((cmd) => {
    //   return {
    //     name: cmd.name,
    //     description: cmd.description,
    //     type: 'CHAT_INPUT',
    //     options: getOptionsFromBuilder(cmd.options),
    //   };
    // });
  }
}

/**
 * Creates a "ChatCommand" module, allowing an easy way to create slash commands, see
 * ChatCommandData for options.
 */
export function ChatCommand<O extends IOptionBuilder>(data: ChatCommandData<O>) {
  return createInstance(ChatCommandHandler, {
    type: 'command',
    autocompleteData: getAutoCompleteHandlersFromBuilder(data.options),
    data,
  });
}

/**
 * Creates a "ChatCommandGroup" module, allowing an easy way to create slash command groups, see
 * ChatCommandGroupData for options.
 *
 * Note: Groups aren't technically required, since all they do is provide descriptions for the
 * finalized command structure, and the current version of discord doesn't show them.
 */
export function ChatCommandGroup(data: ChatCommandGroupData) {
  return createInstance(ChatCommandHandler, {
    type: 'group',
    data,
  });
}
