import type { APIUser } from 'discord-api-types/v10';
import type { ImageURLOptions } from './cdn';
import { formatDefaultUserAvatarURL, formatGuildMemberAvatarURL, formatUserAvatarURL } from './cdn';

/**
 * Given a user object, attempts to resolve an avatar url from it, falling back to a default profile
 * picture if none is found. Image options are ignored for default avatar urls, as Discord only
 * serves these in 256x256 pngs.
 */
export function resolveUserAvatarURL(
  user: Partial<Pick<APIUser, 'id' | 'avatar' | 'discriminator'>>,
  opts?: ImageURLOptions
) {
  if (!user.avatar || !user.id) {
    return formatDefaultUserAvatarURL(user.discriminator ?? 0);
  }

  return formatUserAvatarURL(user.id, user.avatar, opts);
}

/** A flexible structure passed to `resolveMemberAvatarURL` */
export interface UserOrMemberWithAvatarLike {
  id?: string;
  discriminator?: string;
  user?: {
    id?: string;
    discriminator?: string;
    avatar?: string;
  };
  avatar?: string;
}

/**
 * Given a Guild or ID, attempts to resolve an avatar url out of the given user or member object,
 * falling back to a default profile picture if none is found. Image options are ignored for default
 * avatar urls, as Discord only serves these in 256x256 pngs.
 */
export function resolveMemberAvatarURL(
  guildOrId: string | { id: string },
  target: UserOrMemberWithAvatarLike,
  opts?: ImageURLOptions
) {
  const guildId = (guildOrId as { id: string }).id ?? guildOrId;
  const memberId = target.user?.id ?? target.id;

  if (!target.user || !memberId) {
    return resolveUserAvatarURL(target, opts);
  }
  if (target.avatar) {
    return formatGuildMemberAvatarURL(guildId, memberId, target.avatar, opts);
  }
  return resolveUserAvatarURL(target.user, opts);
}
