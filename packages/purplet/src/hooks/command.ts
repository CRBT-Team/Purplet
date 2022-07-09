import type { RESTPostAPIApplicationCommandsJSONBody } from 'purplet/types';
import { $applicationCommands, $interaction } from '../lib/hook-core';
import type { ApplicationCommandResolvable } from '../lib/hook-core-merge';
import { $merge } from '../lib/hook-merge';
import { CommandInteraction, SlashCommandInteraction } from '../structures';

export interface ApplicationCommandHookData {
  command: ApplicationCommandResolvable;
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
    !('isSlashCommandGroup' in opts.command) &&
      $interaction(i => {
        if (
          i instanceof CommandInteraction &&
          i.commandType === (opts.command as RESTPostAPIApplicationCommandsJSONBody).type &&
          getCommandName(i) === (opts.command as RESTPostAPIApplicationCommandsJSONBody).name
        ) {
          opts.handle.call(i);
        }
      }),
  ]);
}
