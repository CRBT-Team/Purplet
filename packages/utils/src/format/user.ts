import type { APIUser } from 'discord-api-types/v10';
import { CDN_BASE_URL } from '../routes';
import type { CdnImageAllowedFormats, CdnImageAllowedSizes } from '../types';

export function getUserDisplayAvatarURL(
  user: APIUser,
  format: CdnImageAllowedFormats = 'png',
  size: CdnImageAllowedSizes
) {
  const urlSuffix = size ? `?size=${size}` : '';

  if (!user.avatar)
    return `${CDN_BASE_URL}/embed/avatars/${Number(user.discriminator) % 5}.${format}${urlSuffix}`;

  return `${CDN_BASE_URL}/avatars/${user.id}/${user.avatar}.${format}${urlSuffix}`;
}
