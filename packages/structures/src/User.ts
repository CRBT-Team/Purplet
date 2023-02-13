import type { Collection } from '@discordjs/collection';
import type { ImageURLOptions, JSONResolvable } from '@purplet/utils';
import { formatUserBannerURL, resolveUserAvatarURL, snowflakeToDate } from '@purplet/utils';
import type {
  APIUser,
  RESTPatchAPICurrentUserJSONBody,
  Snowflake,
  UserPremiumType,
} from 'discord-api-types/v10';
import { ReadonlyUserFlagsBitfield } from './bitfield';
import type { Bitfield } from './bitfield/base';
import { createCache } from './cache';
import { Color } from './color';
import { rest } from './global';
import { cached } from './shared';

export type ModifyCurrentUserData = JSONResolvable<RESTPatchAPICurrentUserJSONBody>;

export const userCache = createCache(
  'user',
  async userId => new User(await rest.user.getUser({ userId })),
  user => user.id
);

export class User {
  //#region Copied Properties
  /**
   * The user's id.
   *
   * Copied directly from the `id` field on the
   * {@link https://discord.com/developers/docs/resources/user#user-object-user-structure Raw User Object}
   */
  readonly id: Snowflake;

  /**
   * The user's username, not unique across the platform.
   *
   * Copied directly from the `username` field on the
   * {@link https://discord.com/developers/docs/resources/user#user-object-user-structure Raw User Object}
   */
  readonly username: string;

  /**
   * The user's 4-digit discord-tag, as a string.
   *
   * Copied directly from the `discriminator` field on the
   * {@link https://discord.com/developers/docs/resources/user#user-object-user-structure Raw User Object}
   */
  readonly discriminator: string;

  /**
   * The user's {@link https://discord.com/developers/docs/reference#image-formatting avatar hash}.
   * To get the URL, use the {@link User#avatarURL} method.
   *
   * Copied directly from the `avatar` field on the
   * {@link https://discord.com/developers/docs/resources/user#user-object-user-structure Raw User Object}
   */
  readonly avatarHash: string | null;

  /**
   * Whether the user belongs to an OAuth2 application, aka is a bot user.
   *
   * Copied directly from the `bot` field on the
   * {@link https://discord.com/developers/docs/resources/user#user-object-user-structure Raw User Object}
   */
  readonly isBot: boolean;

  /**
   * Whether the user is an Official Discord System user (part of the urgent message system).
   *
   * Copied directly from the `system` field on the
   * {@link https://discord.com/developers/docs/resources/user#user-object-user-structure Raw User Object}
   */
  readonly isSystem: boolean;

  /**
   * Whether the user has two factor enabled on their account.
   *
   * Copied directly from the `mfa_enabled` field on the
   * {@link https://discord.com/developers/docs/resources/user#user-object-user-structure Raw User Object}
   */
  readonly isMfaEnabled: boolean;

  /**
   * The user's {@link https://discord.com/developers/docs/reference#image-formatting banner hash}.
   * To get the URL, use the {@link User#bannerURL} method.
   *
   * Copied directly from the `banner` field on the
   * {@link https://discord.com/developers/docs/resources/user#user-object-user-structure Raw User Object}
   */
  readonly bannerHash: string | null;

  /**
   * The user's chosen {@link https://discord.com/developers/docs/reference#locales language option}.
   *
   * Copied directly from the `locale` field on the
   * {@link https://discord.com/developers/docs/resources/user#user-object-user-structure Raw User Object}
   */
  readonly locale: string | null;

  /**
   * Whether the email on this account has been verified.
   *
   * Requires the `email` {@link https://discord.com/developers/docs/topics/oauth2 OAuth2 scope}.
   *
   * Copied directly from the `verified` field on the
   * {@link https://discord.com/developers/docs/resources/user#user-object-user-structure Raw User Object}
   */
  readonly isVerified: boolean;

  /**
   * The user's email.
   *
   * Requires the `email` {@link https://discord.com/developers/docs/topics/oauth2 OAuth2 scope}.
   *
   * Copied directly from the `email` field on the
   * {@link https://discord.com/developers/docs/resources/user#user-object-user-structure Raw User Object}
   */
  readonly email: string | null;

  /**
   * The type of Nitro subscription on a user's account.
   *
   * Copied directly from the `premium_type` field on the
   * {@link https://discord.com/developers/docs/resources/user#user-object-user-structure Raw User Object}
   */
  readonly premiumType: UserPremiumType;
  //#endregion

  constructor(public raw: APIUser) {
    this.id = raw.id;
    this.username = raw.username;
    this.discriminator = raw.discriminator;
    this.avatarHash = raw.avatar;
    this.isBot = !!raw.bot;
    this.isSystem = !!raw.system;
    this.isMfaEnabled = !!raw.mfa_enabled;
    this.bannerHash = raw.banner ?? null;
    this.locale = raw.locale ?? null;
    this.isVerified = !!raw.verified;
    this.email = raw.email ?? null;
    this.premiumType = raw.premium_type ?? 0;
  }

  //#region Cached Getter Properties
  /**
   * The user's banner color.
   *
   * Based on from the `accent_color` field on the
   * {@link https://discord.com/developers/docs/resources/user#user-object-user-structure Raw User Object}
   */
  get accentColor(): Color | null {
    return cached(
      this,
      'accentColor',
      this.raw.accent_color != null ? new Color(this.raw.accent_color) : null
    );
  }

  /**
   * The flags on a user's account as a {@link Bitfield}.
   *
   * Based on the `flags` and `public_flags` fields on the
   * {@link https://discord.com/developers/docs/resources/user#user-object-user-structure Raw User Object}
   */
  get flags(): ReadonlyUserFlagsBitfield {
    return new ReadonlyUserFlagsBitfield(this.raw.flags ?? this.raw.public_flags ?? 0);
  }

  /**
   * The public flags on a user's account as a {@link Bitfield}.
   *
   * Based on the `public_flags` fields on the
   * {@link https://discord.com/developers/docs/resources/user#user-object-user-structure Raw User Object}
   */
  get publicFlags(): ReadonlyUserFlagsBitfield {
    return new ReadonlyUserFlagsBitfield(this.raw.public_flags ?? 0);
  }

  /**
   * The time the user was created at.
   *
   * Derived from the `id` field on the
   * {@link https://discord.com/developers/docs/resources/user#user-object-user-structure Raw User Object}
   */
  get createdAt() {
    return cached(this, 'createdAt', snowflakeToDate(this.id));
  }

  /**
   * The full tag of the user, including their username and discriminator with the "#" symbol. This
   * is unique across the platform, but can be changed.
   *
   * Derived from the `username` and `discriminator` fields on the
   * {@link https://discord.com/developers/docs/resources/user#user-object-user-structure Raw User Object}
   */
  get tag() {
    return cached(this, 'tag', `${this.username}#${this.discriminator}`);
  }
  //#endregion

  //#region Instance Methods
  /**
   * Attempts to resolve an avatar url for the user, falling back to Discord's default if none is
   * found. Image options are ignored for default avatar urls, as Discord only serves these as 256x256 pngs.
   *
   * @param options - The options to use when formatting the URL.
   *
   * @returns The formatted URL.
   */
  avatarURL(options?: ImageURLOptions): string {
    return resolveUserAvatarURL(this.raw, options);
  }

  /**
   * Formats the user's banner URL.
   *
   * @param options - The options to use when formatting the URL.
   *
   * @returns The formatted URL.
   */
  bannerURL(options?: ImageURLOptions): string | null {
    if (this.bannerHash) {
      return formatUserBannerURL(this.id, this.bannerHash, options);
    }
    return null;
  }

  /**
   * Fetches the latest data for this structure. Uses the
   * {@link https://discord.com/developers/docs/resources/user#get-user rest.user.getUser} endpoint.
   */
  async fetch(): Promise<User> {
    return userCache.fetch(this.id, true);
  }
  //#endregion

  //#region Static Methods
  /**
   * Fetches a user by their id.
   *
   * Uses the {@link https://discord.com/developers/docs/resources/user#get-user rest.user.getUser()} method.
   */
  static async fetch(userId: Snowflake, force?: boolean): Promise<User> {
    return userCache.fetch(userId, force);
  }

  /**
   * Fetches the current user. For OAuth2, this requires the `identify` scope, which will return the
   * object _without_ an email, and optionally the `email` scope, which returns the object with an email.
   *
   * Uses the {@link https://discord.com/developers/docs/resources/user#get-user rest.user.getUser()} method.
   */
  static async fetchCurrentUser(force?: boolean): Promise<User> {
    return userCache.fetch('@me', force);
  }

  // TODO: Connection
  /** Returns a list of connection objects. Requires the `connections` OAuth2 scope. */
  static async fetchCurrentUserConnections(): Promise<Collection<Snowflake, never>> {
    throw new Error('Not implemented');
  }

  /**
   * Modify the requester's user account settings. Returns the updated user on success. Fires a
   * {@link https://discord.com/developers/docs/topics/gateway-events#user-update User Update} gateway event.
   *
   * Uses the
   * {@link https://discord.com/developers/docs/resources/user#modify-current-user-json-params rest.user.modifyCurrentUser()}
   * method.
   */
  static async modifyCurrentUser(body: ModifyCurrentUserData): Promise<User> {
    return userCache.insert(
      new User(
        await rest.user.modifyCurrentUser({
          body,
        })
      )
    );
  }
  //#endregion
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TSDocTypes = [Bitfield<any, any>];
