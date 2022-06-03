import type { PermissionFlagsBits } from 'discord.js';
import { BitfieldResolvable, PermissionBitfield } from '../structures';

export interface CommandPermissionsInput {
  permissions?: BitfieldResolvable<typeof PermissionFlagsBits>;
  allowInDM?: boolean;
}

export function resolveCommandPermissions(input: CommandPermissionsInput) {
  return {
    default_member_permissions: input.permissions
      ? PermissionBitfield.resolve(input.permissions).toJSON()
      : null,
    dm_permission: input.allowInDM ?? true,
  };
}
