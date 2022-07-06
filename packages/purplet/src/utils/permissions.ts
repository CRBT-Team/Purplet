import type { PermissionFlagsBits } from 'purplet/types';
import { BitfieldResolvable, PermissionsBitfield } from '../structures';

export interface CommandPermissionsInput {
  permissions?: BitfieldResolvable<typeof PermissionFlagsBits>;
  allowInDM?: boolean;
}

export function resolveCommandPermissions(input: CommandPermissionsInput) {
  return {
    default_member_permissions: input.permissions
      ? PermissionsBitfield.resolve(input.permissions).toString()
      : null,
    dm_permission: input.allowInDM ?? true,
  };
}
