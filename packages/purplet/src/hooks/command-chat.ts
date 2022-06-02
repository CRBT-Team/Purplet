import { ApplicationCommandType, LocalizationMap } from 'discord.js';
import { $interaction } from './basic';
import { $appCommand } from './command';
import { $merge } from './merge';
import {
  getOptionBuilderAutocompleteHandlers,
  OptionBuilder,
  OptionBuilderToPurpletResolvedObject,
} from '../builders';
import { PurpletAutocompleteInteraction, PurpletChatCommandInteraction } from '../structures';
import { camelChoiceToSnake } from '../utils/case';
import { CommandPermissionsInput, resolveCommandPermissions } from '../utils/permissions';

export interface ChatCommandOptions<T> extends CommandPermissionsInput {
  name: string;
  nameLocalizations?: LocalizationMap;
  description: string;
  descriptionLocalizations?: LocalizationMap;
  options?: OptionBuilder<T>;
  handle(
    this: PurpletChatCommandInteraction,
    options: OptionBuilderToPurpletResolvedObject<T>
  ): void;
}

export function $chatCommand<T>(options: ChatCommandOptions<T>) {
  const commandOptions = options.options ? options.options.toJSON() : [];
  const autocompleteHandlers = getOptionBuilderAutocompleteHandlers(options.options);

  return $merge(
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
      handle(this: PurpletChatCommandInteraction) {
        const resolvedOptions = Object.fromEntries(
          commandOptions.map(option => [option.name, this.getResolvedOption(option.name)])
        ) as unknown as OptionBuilderToPurpletResolvedObject<T>;

        options.handle.call(this, resolvedOptions);
      },
    }),
    Object.keys(autocompleteHandlers ?? {}).length > 0 &&
      $interaction(async i => {
        // TODO: complete implementing this.
        if (
          i instanceof PurpletAutocompleteInteraction &&
          i.commandName === options.name &&
          i.commandType === ApplicationCommandType.ChatInput
        ) {
          const resolvedOptions = Object.fromEntries(
            // @ts-expect-error
            commandOptions.map(option => [option.name, i.getOption(option.name)?.value])
          ) as unknown as T;

          i.showAutocompleteResponse({
            choices: (
              await (autocompleteHandlers as any)[i.focusedOption.name].call(i, resolvedOptions)
            ).map(camelChoiceToSnake),
          });
        }
      })
  );
}
