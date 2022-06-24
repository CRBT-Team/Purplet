import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord-api-types/v10';
import type { CommandInteraction, Interaction } from 'discord.js';
import { ApplicationCommandData, createFeature } from '../lib/feature';

function formatCommandName(cmd: ApplicationCommandData) {
  const commandTypeNames = {
    [ApplicationCommandType.ChatInput]: '/',
    [ApplicationCommandType.Message]: 'message',
    [ApplicationCommandType.User]: 'user',
  };
  return cmd.type === ApplicationCommandType.ChatInput
    ? `/${cmd.name}`
    : `"${cmd.name}" on ${commandTypeNames[cmd.type!]}`;
}

export interface ApplicationCommandHookData {
  command: ApplicationCommandData;
  handle(this: Interaction): void;
}

export function getFullCommandName(interaction: Pick<CommandInteraction, 'commandType' | 'commandName' | 'options'>) {
  return interaction.commandType === ApplicationCommandType.ChatInput
    ? [
      interaction.commandName,
      interaction.options.data.find((x) => x.type === ApplicationCommandOptionType.SubcommandGroup)?.name,
      interaction.options.data.find((x) => x.type === ApplicationCommandOptionType.Subcommand)?.name,
    ]
      .filter(Boolean)
      .join(' ')
    : interaction.commandName;
}

export function $applicationCommand(opts: ApplicationCommandHookData) {
  return createFeature({
    name: `command: ${formatCommandName(opts.command)}`,
    applicationCommands: [opts.command],
    interaction(i) {
      if (
        i.isCommand() &&
        i.commandType === opts.command.type &&
        getFullCommandName(i) === opts.command.name
      ) {
        opts.handle.call(i);
      }
    },
  });
}
