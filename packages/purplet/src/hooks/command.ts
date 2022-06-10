import { ApplicationCommandType } from 'discord-api-types/v10';
import type { Interaction } from 'discord.js';
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

export interface AppCommandOptions {
  command: ApplicationCommandData;
  handle(this: Interaction): void;
}

export function $appCommand(opts: AppCommandOptions) {
  return createFeature({
    name: `command: ${formatCommandName(opts.command)}`,
    applicationCommands: [opts.command],
    interaction(i) {
      if (
        i.isCommand() &&
        i.commandType === opts.command.type &&
        i.commandName === opts.command.name
      ) {
        opts.handle.call(i);
      }
    },
  });
}
