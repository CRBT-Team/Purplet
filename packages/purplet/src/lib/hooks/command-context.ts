import {
  APIMessage,
  APIUser,
  ApplicationCommandType,
  LocalizationMap,
  PermissionsBitField,
  User,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { $appCommand } from './command-basic';
import type {
  PurpletMessageCommandInteraction,
  PurpletUserCommandInteraction,
} from '../structures/interaction';
import { CommandPermissionsInput, resolveCommandPermissions } from '../../utils/permissions';

export interface ContextCommandOptions extends CommandPermissionsInput {
  name: string;
  nameLocalizations?: LocalizationMap;
}

export interface UserCommandOptions extends ContextCommandOptions {
  handle: (this: PurpletUserCommandInteraction, target: APIUser) => void;
}

export function $userContextCommand(opts: UserCommandOptions) {
  return $appCommand({
    command: {
      type: ApplicationCommandType.User,
      name: opts.name,
      name_localizations: opts.nameLocalizations,
      ...resolveCommandPermissions(opts),
    },
    handle(this: PurpletUserCommandInteraction) {
      opts.handle.call(this, this.targetUser);
    },
  });
}

export interface DJSUserCommandOptions extends ContextCommandOptions {
  handle: (this: UserContextMenuCommandInteraction, target: User) => void;
}

export function $djsUserContextCommand(options: DJSUserCommandOptions) {
  return $userContextCommand({
    ...options,
    handle() {
      const i = this.toDJS();
      options.handle.call(i, i.targetUser);
    },
  });
}

export interface MessageCommandOptions extends ContextCommandOptions {
  handle: (this: PurpletMessageCommandInteraction, target: APIMessage) => void;
}

export function $messageContextCommand(opts: MessageCommandOptions) {
  return $appCommand({
    command: {
      type: ApplicationCommandType.User,
      name: opts.name,
      name_localizations: opts.nameLocalizations,
      default_member_permissions: opts.permissions
        ? PermissionsBitField.resolve(opts.permissions).toString()
        : null,
      dm_permission: opts.allowInDM,
    },
    handle(this: PurpletMessageCommandInteraction) {
      opts.handle.call(this, this.target);
    },
  });
}

export interface DJSMessageCommandOptions extends ContextCommandOptions {
  handle: (this: UserContextMenuCommandInteraction, target: User) => void;
}

export function $djsMessageCommand(options: DJSMessageCommandOptions) {
  return $messageContextCommand({
    ...options,
    handle() {
      const i = this.toDJS();
      options.handle.call(i, i.message);
    },
  });
}
