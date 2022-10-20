import { CDN_BASE_URL } from '../routes';

export type CDNImageFormat = 'png' | 'jpeg' | 'webp' | 'jpg' | 'gif';
/**
 * Discord's CDN has a size query string parameter for image resizing. They claim only powers of two
 * from 16 to 4096 are allowed, but a few other values work. This type provides the valid values as
 * strings, but also allows any `number` type to passthrough for ease of use.
 */
export type CDNImageSize =
  | number
  | '16'
  | '32'
  | '64'
  | '128'
  | '256'
  | '512'
  | '1024'
  | '2048'
  | '4096'
  // Valid but not in public API.
  | '96'
  | '300'
  | '480'
  | '600'
  | '1280';

export interface ImageURLOptions {
  format?: CDNImageFormat;
  size?: CDNImageSize;
}

function formatImageURL(base: string, { format, size }: ImageURLOptions = {}) {
  // Image hashes starting with "a_" are animated, and should default to gif.
  format = format ?? (base.includes('/a_') ? 'gif' : 'webp');
  return `${CDN_BASE_URL}${base}.${format}${size ? `?size=${size}` : ''}`;
}

export function formatEmojiURL(emojiId: string, opts?: ImageURLOptions) {
  return formatImageURL(`/emojis/${emojiId}`, opts);
}

export function formatGuildIconURL(guildId: string, guildIcon: string, opts?: ImageURLOptions) {
  return formatImageURL(`/icons/${guildId}/${guildIcon}`, opts);
}

export function formatGuildSplashURL(guildId: string, guildSplash: string, opts?: ImageURLOptions) {
  return formatImageURL(`/splashes/${guildId}/${guildSplash}`, opts);
}

export function formatGuildDiscoverySplashURL(
  guildId: string,
  guildDiscoverySplash: string,
  opts?: ImageURLOptions
) {
  return formatImageURL(`/discovery-splashes/${guildId}/${guildDiscoverySplash}`, opts);
}

export function formatGuildBannerURL(guildId: string, guildBanner: string, opts?: ImageURLOptions) {
  return formatImageURL(`/banners/${guildId}/${guildBanner}`, opts);
}

export function formatUserBannerURL(userId: string, userBanner: string, opts?: ImageURLOptions) {
  return formatImageURL(`/banners/${userId}/${userBanner}`, opts);
}

/**
 * Unlike the rest of the CDN route url formatting functions, this one does not support customizing
 * the format or the size, as discord does not serve anything other than 256x256 pngs.
 */
export function formatDefaultUserAvatarURL(discriminator: string | number) {
  return formatImageURL(`/embed/avatars/${Number(discriminator) % 5}`, {
    format: 'png',
  });
}

export function formatUserAvatarURL(userId: string, userAvatar: string, opts?: ImageURLOptions) {
  return formatImageURL(`/avatars/${userId}/${userAvatar}`, opts);
}

export function formatGuildMemberAvatarURL(
  guildId: string,
  userId: string,
  memberAvatar: string,
  opts?: ImageURLOptions
) {
  return formatImageURL(`/guilds/${guildId}/users/${userId}/avatars/${memberAvatar}`, opts);
}

export function formatApplicationIconURL(
  applicationId: string,
  iconHash: string,
  opts?: ImageURLOptions
) {
  return formatImageURL(`/app-icons/${applicationId}/${iconHash}`, opts);
}

export function formatApplicationCoverURL(
  applicationId: string,
  coverImage: string,
  opts?: ImageURLOptions
) {
  return formatImageURL(`/app-icons/${applicationId}/${coverImage}`, opts);
}

export function formatApplicationAssetURL(
  applicationId: string,
  assetId: string,
  opts?: ImageURLOptions
) {
  return formatImageURL(`/app-assets/${applicationId}/${assetId}`, opts);
}

export function formatAchievementIconURL(
  applicationId: string,
  achievementId: string,
  iconHash: string,
  opts?: ImageURLOptions
) {
  return formatImageURL(
    `/app-assets/${applicationId}/achievements/${achievementId}/icons/${iconHash}`,
    opts
  );
}

export function formatStickerPackBannerURL(assetId: string, opts?: ImageURLOptions) {
  return formatImageURL(`/app-assets/710982414301790216/store/${assetId}`, opts);
}

export function formatTeamIconURL(teamId: string, teamIcon: string, opts?: ImageURLOptions) {
  return formatImageURL(`/team-icons/${teamId}/${teamIcon}`, opts);
}

/** This type exists to allow for querying lottie sticker .json files. */
export interface StickerImageURLOptions {
  format?: CDNImageFormat | 'json';
  size?: CDNImageSize;
}

export function formatStickerURL(stickerId: string, opts?: StickerImageURLOptions) {
  return formatImageURL(`/sticker/${stickerId}`, opts as ImageURLOptions);
}

export function formatRoleIconURL(roleId: string, roleIcon: string, opts?: ImageURLOptions) {
  return formatImageURL(`/role-icons/${roleId}/${roleIcon}`, opts);
}

export function formatGuildEventCoverURL(
  eventId: string,
  eventIcon: string,
  opts?: ImageURLOptions
) {
  return formatImageURL(`/guild-events/${eventId}/${eventIcon}`, opts);
}

export function formatGuildMemberBannerURL(
  guildId: string,
  userId: string,
  bannerId: string,
  opts?: ImageURLOptions
) {
  return formatImageURL(`/guilds/${guildId}/users/${userId}/banners/${bannerId}`, opts);
}

export function formatAttachmentURL(channelId: string, attachmentId: string, filename: string) {
  return `${CDN_BASE_URL}/attachments/${channelId}/${attachmentId}/${filename}`;
}
