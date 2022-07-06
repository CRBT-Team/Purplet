import { ApplicationCommandType, LocalizationMap } from 'purplet/types';
import { $appCommand, $appCommandMergeHook } from './command';
import {
  getOptionBuilderAutocompleteHandlers,
  OptionBuilder,
  OptionBuilderToPurpletResolvedObject,
} from '../builders';
import { $interaction } from '../lib/hook-core';
import { $merge } from '../lib/hook-merge';
import { AutocompleteInteraction, SlashCommandInteraction } from '../structures';
import { camelChoiceToSnake } from '../utils/case';
import { toJSONValue } from '../utils/json';
import { CommandPermissionsInput, resolveCommandPermissions } from '../utils/permissions';

export interface SlashCommandData<T> extends CommandPermissionsInput {
  name: string;
  nameLocalizations?: LocalizationMap;
  description: string;
  descriptionLocalizations?: LocalizationMap;
  options?: OptionBuilder<T>;
  handle(this: SlashCommandInteraction, options: OptionBuilderToPurpletResolvedObject<T>): void;
}

export function $slashCommand<T>(options: SlashCommandData<T>) {
  const commandOptions = toJSONValue(options.options ?? []);
  const autocompleteHandlers = getOptionBuilderAutocompleteHandlers(options.options);

  return $merge([
    $appCommand({
      command: {
        type: ApplicationCommandType.ChatInput,
        name: options.name,
        name_localizations: options.nameLocalizations,
        description: options.description,
        description_localizations: options.descriptionLocalizations,
        ...resolveCommandPermissions(options),
        options: commandOptions,
      },
      handle(this: SlashCommandInteraction) {
        const resolvedOptions = Object.fromEntries(
          commandOptions.map(option => [option.name, this.getResolvedOption(option.name)])
        ) as unknown as OptionBuilderToPurpletResolvedObject<T>;

        options.handle.call(this, resolvedOptions);
      },
    }),
    Object.keys(autocompleteHandlers ?? {}).length > 0 &&
      $interaction(async i => {
        if (
          AutocompleteInteraction.is(i) &&
          i.fullCommandName === options.name &&
          i.commandType === ApplicationCommandType.ChatInput
        ) {
          const resolvedOptions = Object.fromEntries(
            commandOptions.map(option => [option.name, (i.getOption(option.name) as any)?.value])
          ) as unknown as T;

          i.showAutocompleteResponse(
            (
              await (autocompleteHandlers as any)[i.focusedOption.name].call(i, resolvedOptions)
            ).map(camelChoiceToSnake)
          );
        }
      }),
  ]);
}

export interface SlashCommandGroupData extends CommandPermissionsInput {
  name: string;
  nameLocalizations?: LocalizationMap;
  description: string;
  descriptionLocalizations?: LocalizationMap;
}

export function $slashCommandGroup(data: SlashCommandGroupData) {
  return $appCommandMergeHook({
    isSlashCommandGroup: true,
    name: data.name,
    name_localizations: data.nameLocalizations,
    description: data.description,
    description_localizations: data.descriptionLocalizations,
    ...resolveCommandPermissions(data),
  });
}
