import type { Immutable } from '@davecode/types';
import type { ImageURLOptions } from '@discordjs/rest';
import type { APIUser } from 'purplet/types';
import { UserFlagsBitfield } from './bit-field';
import type { Interaction } from './interaction';
import { rest } from '../lib/global';
import { createPartialClass, PartialClass } from '../utils/class';

/** Structure for APIUser. */
export class User {
  constructor(readonly raw: Immutable<APIUser>) {}

  async fetch() {
    return new User(await rest.user.getUser({ userId: this.id }));
  }

  get id() {
    return this.raw.id;
  }

  get username() {
    return this.raw.username;
  }

  get discriminator() {
    return this.raw.discriminator;
  }

  get tag() {
    return `${this.username}#${this.discriminator}`;
  }

  get avatarHash() {
    return this.raw.avatar;
  }

  get bannerHash() {
    return this.raw.banner;
  }

  get bannerColor(): string | null {
    // @ts-expect-error Missing from discord-api-types???
    return this.raw.banner_color;
  }

  get accentColor() {
    return this.raw.accent_color;
  }

  get flags() {
    return new UserFlagsBitfield(this.raw.flags ?? this.raw.public_flags);
  }

  get hypesquadHouse() {
    const flags = this.flags;
    return flags.hasHypeSquadOnlineHouse1
      ? 'bravery'
      : flags.hasHypeSquadOnlineHouse2
      ? 'brilliance'
      : flags.hasHypeSquadOnlineHouse3
      ? 'balance'
      : null;
  }

  get isBot() {
    return this.raw.bot ?? this.raw.system;
  }

  get defaultAvatarURL() {
    return rest.cdn.defaultAvatar(parseInt(this.discriminator, 10) % 5);
  }

  avatarURL(options: ImageURLOptions = {}) {
    return this.avatarHash
      ? rest.cdn.avatar(this.id, this.avatarHash, options)
      : this.defaultAvatarURL;
  }

  bannerURL(options: ImageURLOptions = {}) {
    return this.bannerHash ? rest.cdn.banner(this.id, this.bannerHash, options) : null;
  }

  // TODO: uncomment and tweak when released.
  // get avatarDecorationId() {
  //   // @ts-expect-error Unreleased, so obviously missing from discord-api-types
  //   return this.raw.avatar_decoration;
  // }

  toString() {
    return `<@${this.id}>`;
  }
}

// Uncomment if needed
// export class OAuthUser extends User {
//   get isEmailVerified() {
//     return this.raw.verified;
//   }
//
//   get email() {
//     return this.raw.email;
//   }
// }

// InteractionExecutingUser refers to the user that is executing an interaction, seen on `interaction.user`.
// InteractionUser refers to user data that is passed to an interaction.
export type PartialUser = PartialClass<
  // Class, Required properties from `raw`, Allowed methods from class
  typeof User,
  'id' | 'username' | 'public_flags' | 'discriminator' | 'avatar', // | 'avatar_decoration',
  | 'id'
  | 'username'
  | 'flags'
  | 'discriminator'
  | 'tag'
  | 'avatarHash'
  | 'avatarURL'
  | 'defaultAvatarURL'
  | 'hypesquadHouse'
  | 'isBot'
  | 'fetch'
  | 'toString'
>;
export const PartialUser = createPartialClass<PartialUser>(User);

export type EmptyUser = PartialClass<
  // Class, Required properties from `raw`, Allowed methods from class
  typeof User,
  'id',
  'id' | 'fetch' | 'toString'
>;
export const EmptyUser = createPartialClass<EmptyUser>(User);

export class InteractionExecutingUser extends PartialUser {
  constructor(readonly raw: APIUser, readonly interaction: Interaction) {
    super(raw);
  }

  get locale() {
    return this.interaction.locale;
  }
}
