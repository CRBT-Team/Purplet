import { APIMessage, ApplicationCommandType, LocalizationMap } from 'discord-api-types/v10';
import type {
  Message,
  MessageContextMenuCommandInteraction,
  User,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { $applicationCommand } from './command';
import { CommandPermissionsInput, resolveCommandPermissions } from '../utils/permissions';

export interface ContextCommandOptions extends CommandPermissionsInput {
  name: string;
  nameLocalizations?: LocalizationMap;
}

export interface UserCommandOptions extends ContextCommandOptions {
  handle: (this: UserContextMenuCommandInteraction, target: User) => void;
}

export function $userContextCommand(opts: UserCommandOptions) {
  return $applicationCommand({
    command: {
      type: ApplicationCommandType.User,
      name: opts.name,
      name_localizations: opts.nameLocalizations,
      ...resolveCommandPermissions(opts),
    },
    handle(this: UserContextMenuCommandInteraction) {
      opts.handle.call(this, this.targetUser);
    },
  });
}

export interface MessageCommandOptions extends ContextCommandOptions {
  handle: (this: MessageContextMenuCommandInteraction, target: APIMessage | Message) => void;
}

export function $messageContextCommand(opts: MessageCommandOptions) {
  return $applicationCommand({
    command: {
      type: ApplicationCommandType.Message,
      name: opts.name,
      name_localizations: opts.nameLocalizations,
      ...resolveCommandPermissions(opts),
    },
    handle(this: MessageContextMenuCommandInteraction) {
      opts.handle.call(this, this.targetMessage);
    },
  });
}
