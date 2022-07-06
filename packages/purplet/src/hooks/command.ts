import {
  APIApplicationCommandBasicOption,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'purplet/types';
import type { SlashCommandGroupData } from './command-slash';
import { createHook } from '../lib/hook';
import { $applicationCommands, $interaction } from '../lib/hook-core';
import { $merge } from '../lib/hook-merge';
import { CommandInteraction, SlashCommandInteraction } from '../structures';

type Command = RESTPostAPIApplicationCommandsJSONBody;
type SlashCommand = RESTPostAPIChatInputApplicationCommandsJSONBody;

export type ApplicationCommandResolvable =
  | Command
  | (SlashCommandGroupData & { isSlashCommandGroup: true });

export const $appCommandMergeHook = createHook<ApplicationCommandResolvable, 'data'>({
  id: 'purplet:app-command-merge-hook',
  type: 'data',
  transformDataToMoreHooks(list) {
    const commands = list.filter(x => !('isSlashCommandGroup' in x)) as Command[];
    const groups = list.filter(x => 'isSlashCommandGroup' in x) as SlashCommandGroupData[];

    const toBeMerged = commands.filter(
      x => x.type === ApplicationCommandType.ChatInput && x.name.includes(' ')
    );
    const commandNamesToBeMerged = [...new Set(toBeMerged.map(x => x.name.split(' ')[0]))];
    const rest = list.filter(x => !toBeMerged.includes(x));

    for (const name of commandNamesToBeMerged) {
      const group = groups.find(x => x.name === name);
      if (!group) {
        throw new Error(`Could not find slash command group "${name}"`);
      }

      const cmd: SlashCommand & { isSlashCommandGroup?: any } = {
        ...group,
        options: [],
      };
      delete cmd.isSlashCommandGroup;

      const merged = toBeMerged.filter(x => x.name.startsWith(name + ' ')) as SlashCommand[];

      if (merged.some(x => x.name.split(' ').length === 3)) {
        cmd.options = merged
          .filter(x => x.name.split(' ').length === 2)
          .map(x => ({
            name: x.name.split(' ')[1],
            type: ApplicationCommandOptionType.SubcommandGroup,
            description: x.description,
            name_localizations: x.name_localizations,
            description_localizations: x.description_localizations,
            options: merged
              .filter(x => x.name.split(' ').length === 3)
              .map(x => ({
                name: x.name.split(' ')[2],
                type: ApplicationCommandOptionType.Subcommand,
                description: x.description,
                name_localizations: x.name_localizations,
                description_localizations: x.description_localizations,
                options: x.options as APIApplicationCommandBasicOption[],
              })),
          }));
      } else {
        cmd.options = merged.map(x => ({
          name: x.name.split(' ')[1],
          type: ApplicationCommandOptionType.Subcommand,
          description: x.description,
          name_localizations: x.name_localizations,
          description_localizations: x.description_localizations,
          options: x.options as APIApplicationCommandBasicOption[],
        }));
      }

      rest.push(group);
    }

    return $applicationCommands(rest);
  },
});

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
    $appCommandMergeHook(opts.command),
    !('isSlashCommandGroup' in opts.command) &&
      $interaction(i => {
        if (
          i instanceof CommandInteraction &&
          i.commandType === (opts.command as RESTPostAPIApplicationCommandsJSONBody).type &&
          getCommandName(i) === opts.command.name
        ) {
          opts.handle.call(i);
        }
      }),
  ]);
}
