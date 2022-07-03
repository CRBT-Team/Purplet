import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import { $applicationCommands, $interaction } from '../lib/hook-core';
import { $merge } from '../lib/hook-merge';
import { CommandInteraction, SlashCommandInteraction } from '../structures';

export interface ApplicationCommandHookData {
  command: RESTPostAPIApplicationCommandsJSONBody;
  handle(this: CommandInteraction): void;
}

function getCommandName(interaction: CommandInteraction) {
  return interaction instanceof SlashCommandInteraction
    ? interaction.fullCommandName
    : interaction.commandName;
}

export function $appCommand(opts: ApplicationCommandHookData) {
  return $merge([
    $applicationCommands([opts.command]),
    $interaction(i => {
      if (
        i instanceof CommandInteraction &&
        i.commandType === opts.command.type &&
        getCommandName(i) === opts.command.name
      ) {
        opts.handle.call(i);
      }
    }),
  ]);
}
