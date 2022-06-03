import type { Immutable } from '@davecode/types';
import type { ImageURLOptions } from '@discordjs/rest';
import type { APIUser } from 'discord-api-types/v10';
import { UserFlagsBitfield } from './bit-field';
import type { Interaction } from './interaction';
import { rest } from '../lib/global';
import { createPartialClass, PartialClass } from '../utils/partial';

/** Structure for APIUser. */
export class User {
  constructor(readonly raw: Immutable<APIUser>) {}

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

  get avatarId() {
    return this.raw.avatar;
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

  get isMFAEnabled() {
    return this.raw.mfa_enabled;
  }

  get defaultAvatarURL() {
    return rest.cdn.defaultAvatar(parseInt(this.discriminator, 10) % 5);
  }

  avatarURL(options: ImageURLOptions = {}) {
    return this.raw.avatar
      ? rest.cdn.avatar(this.id, this.raw.avatar, options)
      : this.defaultAvatarURL;
  }

  get premiumType() {
    return this.raw.premium_type ?? 0;
  }

  get locale() {
    return this.raw.locale ?? 'en-US';
  }
}

export class UserWithEmail extends User {
  get isEmailVerified() {
    return this.raw.verified;
  }

  get email() {
    return this.raw.email;
  }
}

// InteractionExecutingUser refers to the user that is executing an interaction, seen on `interaction.user`.
// InteractionUser refers to user data that is passed to an interaction.
export type InteractionUser = PartialClass<
  // Class, Required properties from `raw`, Allowed methods from class
  typeof User,
  'id' | 'username' | 'public_flags' | 'discriminator' | 'avatar', // | 'avatar_decoration',
  | 'id'
  | 'username'
  | 'flags'
  | 'discriminator'
  | 'tag'
  | 'avatarId'
  | 'avatarURL'
  | 'defaultAvatarURL'
  | 'hypesquadHouse'
  | 'isBot'
>;
export const InteractionUser = createPartialClass<InteractionUser>(User);

export class InteractionExecutingUser extends InteractionUser {
  constructor(readonly raw: APIUser, readonly interaction: Interaction) {
    super(raw);
  }

  get locale() {
    return this.interaction.locale;
  }
}
