import {
  ApplicationCommandType,
  LocalizationMap,
  PermissionResolvable,
  PermissionsBitField,
} from 'discord.js';
import { $appCommand } from './command-basic';
import type { OptionBuilder } from '../builders/OptionBuilder';
import type { PurpletChatCommandInteraction } from '../interaction';

export interface ChatCommandOptions<T> {
  name: string;
  nameLocalizations?: LocalizationMap;
  description: string;
  descriptionLocalizations?: LocalizationMap;
  permissions?: PermissionResolvable;
  allowInDM?: boolean;
  options?: OptionBuilder<T>;
  handle(this: PurpletChatCommandInteraction, options: T): void;
}

export function $chatCommand<T>(options: ChatCommandOptions<T>) {
  const commandOptions = options.options ? options.options.toJSON() : [];
  return $appCommand({
    command: {
      type: ApplicationCommandType.ChatInput,
      name: options.name,
      name_localizations: options.nameLocalizations,
      description: options.description,
      description_localizations: options.descriptionLocalizations,
      default_member_permissions: options.permissions
        ? PermissionsBitField.resolve(options.permissions).toString()
        : null,
      dm_permission: options.allowInDM,
      options: commandOptions,
    },
    handle(this: PurpletChatCommandInteraction) {
      const resolvedOptions = Object.fromEntries(
        commandOptions.map(option => [option.name, this.getResolvedOption(option.name)])
      ) as unknown as T;
      options.handle.call(this, resolvedOptions);
    },
  });
}
