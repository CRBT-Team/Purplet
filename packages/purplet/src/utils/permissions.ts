import type { PermissionFlagsBits } from 'discord-api-types/v10';
import { BitfieldResolvable, PermissionBitfield } from '../structures';

export interface CommandPermissionsInput {
  permissions?: BitfieldResolvable<typeof PermissionFlagsBits>;
  allowInDM?: boolean;
}

export function resolveCommandPermissions(input: CommandPermissionsInput) {
  return {
    default_member_permissions: input.permissions
      ? PermissionBitfield.resolve(input.permissions).toString()
      : null,
    dm_permission: input.allowInDM ?? true,
  };
}
