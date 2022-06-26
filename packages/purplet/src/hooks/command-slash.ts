import { ApplicationCommandType, LocalizationMap } from 'discord-api-types/v10';
import { $interaction } from './basic';
import { $applicationCommand } from './command';
import { $merge } from './merge';
import {
  getOptionBuilderAutocompleteHandlers,
  OptionBuilder,
  OptionBuilderToPurpletResolvedObject,
} from '../builders';
import { createFeature } from '../lib/feature';
import { AutocompleteInteraction, SlashCommandInteraction } from '../structures';
import { camelChoiceToSnake } from '../utils/case';
import { CommandPermissionsInput, resolveCommandPermissions } from '../utils/permissions';
import { toJSONValue } from '../utils/plain';

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

  return $merge(
    $applicationCommand({
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
        ) as OptionBuilderToPurpletResolvedObject<T>;

        options.handle.call(this, resolvedOptions);
      },
    }),
    Object.keys(autocompleteHandlers ?? {}).length > 0 &&
      $interaction(async i => {
        // TODO: complete implementing this.
        if (
          AutocompleteInteraction.is(i) &&
          i.fullCommandName === options.name &&
          i.commandType === ApplicationCommandType.ChatInput
        ) {
          const resolvedOptions = Object.fromEntries(
            commandOptions.map(option => [option.name, i.getOption(option.name)])
          ) as unknown as T;

          i.showAutocompleteResponse(
            (
              await (autocompleteHandlers as any)[i.focusedOption.name].call(i, resolvedOptions)
            ).map(camelChoiceToSnake)
          );
        }
      })
  );
}

export interface SlashCommandGroupData extends CommandPermissionsInput {
  name: string;
  nameLocalizations?: LocalizationMap;
  description: string;
  descriptionLocalizations?: LocalizationMap;
}

export function $slashCommandGroup(data: SlashCommandGroupData) {
  return createFeature({
    applicationCommands: [
      {
        name: data.name,
        name_localizations: data.nameLocalizations,
        description: data.description,
        description_localizations: data.descriptionLocalizations,
        options: [],
        ...resolveCommandPermissions(data),
      },
    ],
  });
}
