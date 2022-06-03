import { ApplicationCommandType, LocalizationMap } from 'discord-api-types/v10';
import { $appCommand } from './command';
import type {
  Message,
  MessageCommandInteraction,
  PartialUser,
  UserCommandInteraction,
} from '../structures';
import { CommandPermissionsInput, resolveCommandPermissions } from '../utils/permissions';

export interface ContextCommandOptions extends CommandPermissionsInput {
  name: string;
  nameLocalizations?: LocalizationMap;
}

export interface UserCommandOptions extends ContextCommandOptions {
  handle: (this: UserCommandInteraction, target: PartialUser) => void;
}

export function $userContextCommand(opts: UserCommandOptions) {
  return $appCommand({
    command: {
      type: ApplicationCommandType.User,
      name: opts.name,
      name_localizations: opts.nameLocalizations,
      ...resolveCommandPermissions(opts),
    },
    handle(this: UserCommandInteraction) {
      opts.handle.call(this, this.targetUser);
    },
  });
}

// export interface DJSUserCommandOptions extends ContextCommandOptions {
//   handle: (this: UserContextMenuCommandInteraction, target: User) => void;
// }

// export function $djsUserContextCommand(options: DJSUserCommandOptions) {
//   return $userContextCommand({
//     ...options,
//     handle() {
//       const i = this.toDJS();
//       options.handle.call(i, i.targetUser);
//     },
//   });
// }

export interface MessageCommandOptions extends ContextCommandOptions {
  handle: (this: MessageCommandInteraction, target: Message) => void;
}

export function $messageContextCommand(opts: MessageCommandOptions) {
  return $appCommand({
    command: {
      type: ApplicationCommandType.Message,
      name: opts.name,
      name_localizations: opts.nameLocalizations,
      ...resolveCommandPermissions(opts),
    },
    handle(this: MessageCommandInteraction) {
      opts.handle.call(this, this.target);
    },
  });
}

// export interface DJSMessageCommandOptions extends ContextCommandOptions {
//   handle: (this: UserContextMenuCommandInteraction, target: User) => void;
// }
//
// export function $djsMessageCommand(options: DJSMessageCommandOptions) {
//   return $messageContextCommand({
//     ...options,
//     handle() {
//       const i = this.toDJS();
//       options.handle.call(i, i.message);
//     },
//   });
// }
