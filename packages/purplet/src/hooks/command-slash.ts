import {
  APIApplicationCommandOption,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  LocalizationMap,
} from 'discord-api-types/v10';
import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';
import { $interaction } from './basic';
import { $applicationCommand, getFullCommandName } from './command';
import { $merge } from './merge';
import {
  getOptionBuilderAutocompleteHandlers,
  OptionBuilder,
  OptionBuilderToDJSResolvedObject,
} from '../builders';
import { createFeature } from '../lib/feature';
import { camelChoiceToSnake } from '../utils/case';
import { CommandPermissionsInput, resolveCommandPermissions } from '../utils/permissions';
import { toJSONValue } from '../utils/plain';

export interface SlashCommandData<T> extends CommandPermissionsInput {
  name: string;
  nameLocalizations?: LocalizationMap;
  description: string;
  descriptionLocalizations?: LocalizationMap;
  options?: OptionBuilder<T>;
  handle(this: ChatInputCommandInteraction, options: OptionBuilderToDJSResolvedObject<T>): void;
}

function getResolved(
  resolver: CommandInteractionOptionResolver,
  option: APIApplicationCommandOption
) {
  switch (option.type) {
    case ApplicationCommandOptionType.String:
    case ApplicationCommandOptionType.Number:
    case ApplicationCommandOptionType.Integer:
    case ApplicationCommandOptionType.Boolean:
      return resolver.get(option.name)?.value;
    case ApplicationCommandOptionType.Attachment:
      return resolver.getAttachment(option.name);
    case ApplicationCommandOptionType.Channel:
      return resolver.getChannel(option.name);
    case ApplicationCommandOptionType.Mentionable:
      return resolver.getMentionable(option.name);
    case ApplicationCommandOptionType.Role:
      return resolver.getRole(option.name);
    case ApplicationCommandOptionType.User:
      return resolver.getUser(option.name);

    default:
      return null;
  }
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
      handle(this: ChatInputCommandInteraction) {
        const resolvedOptions = Object.fromEntries(
          commandOptions.map(option => [
            option.name,
            getResolved(this.options as CommandInteractionOptionResolver, option),
          ])
        ) as unknown as OptionBuilderToDJSResolvedObject<T>;

        options.handle.call(this, resolvedOptions);
      },
    }),
    Object.keys(autocompleteHandlers ?? {}).length > 0 &&
      $interaction(async i => {
        // TODO: complete implementing this.
        if (
          i instanceof AutocompleteInteraction &&
          getFullCommandName(i) === options.name &&
          i.commandType === ApplicationCommandType.ChatInput
        ) {
          const resolvedOptions = Object.fromEntries(
            commandOptions.map(option => [option.name, i.options.get(option.name)?.value])
          ) as unknown as T;

          i.respond(
            (
              await (autocompleteHandlers as any)[i.options.getFocused(true).name].call(
                i,
                resolvedOptions
              )
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
