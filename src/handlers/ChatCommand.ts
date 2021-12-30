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
  name: string;
  description: string;
  options?: O;
  handle: (this: CommandInteraction, options: GetOptionsFromBuilder<O>) => void;
}

export interface ChatCommandGroupData {
  name: string;
  description: string;
}

type ChatCommandHandlerData =
  | {
      type: 'command';
      data: ChatCommandData;
      autocompleteData: Record<string, Autocomplete<unknown, unknown>>;
    }
  | { type: 'group'; data: ChatCommandGroupData };

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

export class ChatCommandHandler extends Handler<ChatCommandHandlerData> {
  commands = new Map<string, ChatCommandHandlerData>();

  handleInteraction = async (interaction: Interaction) => {
    if (interaction.isCommand()) {
      const name = [
        interaction.commandName,
        interaction.options.getSubcommandGroup(false),
        interaction.options.getSubcommand(false),
      ]
        .filter(Boolean)
        .join(' ');

      const module = this.commands.get(name);
      if (module && module.type === 'command') {
        const options = Object.fromEntries(
          await Promise.all(
            interaction.options.data
              .flatMap((x) => (x.type === 'SUB_COMMAND_GROUP' ? x.options || [] : [x]))
              .flatMap((x) => (x.type === 'SUB_COMMAND' ? x.options || [] : [x]))
              .map(async (opt) => [
                opt.name,
                await resolveOptionValue(this.client, interaction.guild, opt),
              ])
          )
        );
        module.data.handle.call(interaction, options);
      }
    } else if (interaction.isAutocomplete()) {
      const name = [
        interaction.commandName,
        interaction.options.getSubcommandGroup(false),
        interaction.options.getSubcommand(false),
      ]
        .filter(Boolean)
        .join(' ');

      const module = this.commands.get(name);
      if (module && module.type === 'command') {
        const autocompleteData = module.autocompleteData;
        const options = interaction.options.data
          .flatMap((x) => (x.type === 'SUB_COMMAND_GROUP' ? x.options || [] : [x]))
          .flatMap((x) => (x.type === 'SUB_COMMAND' ? x.options || [] : [x]));
        const focused = options.find((x) => x.focused);
        const handler = autocompleteData[focused!.name];
        const optionsObj = Object.fromEntries(
          await Promise.all(
            options.map(async (opt) => [
              opt.name,
              await resolveOptionValue(this.client, interaction.guild, opt),
            ])
          )
        );
        const choices = await handler(optionsObj);
        interaction.respond(choices.slice(0, 25));
      }
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

export function ChatCommand<O extends IOptionBuilder>(data: ChatCommandData<O>) {
  return createInstance(ChatCommandHandler, {
    type: 'command',
    autocompleteData: getAutoCompleteHandlersFromBuilder(data.options),
    data,
  });
}

export function ChatCommandGroup(data: ChatCommandGroupData) {
  return createInstance(ChatCommandHandler, {
    type: 'group',
    data,
  });
}
