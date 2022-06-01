import { ApplicationCommandType } from 'discord.js';
import { ApplicationCommandData, createFeature } from '../feature';
import { PurpletCommandInteraction, PurpletInteraction } from '../structures/interaction';

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

export interface AppCommandOptions {
  command: ApplicationCommandData;
  handle(this: PurpletInteraction): void;
}

export function $appCommand(opts: AppCommandOptions) {
  return createFeature({
    name: `command: ${formatCommandName(opts.command)}`,
    applicationCommands: [opts.command],
    interaction(i) {
      if (
        i instanceof PurpletCommandInteraction &&
        i.commandType === opts.command.type &&
        i.commandName === opts.command.name
      ) {
        opts.handle.call(i);
      }
    },
  });
}
