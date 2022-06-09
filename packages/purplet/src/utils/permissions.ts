import type { PermissionResolvable } from 'discord.js';
import { PermissionsBitField } from 'discord.js';

export interface CommandPermissionsInput {
  permissions?: PermissionResolvable;
  allowInDM?: boolean;
}

export function resolveCommandPermissions(input: CommandPermissionsInput) {
  return {
    default_member_permissions: input.permissions
      ? PermissionsBitField.resolve(input.permissions).toString()
      : null,
    dm_permission: input.allowInDM ?? true,
  };
}
