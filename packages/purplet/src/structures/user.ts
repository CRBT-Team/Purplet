import type { Immutable } from '@davecode/types';
import type { APIUser } from 'discord.js';

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

  get isBot() {
    return this.raw.bot ?? this.raw.system;
  }

  protected get flagBits() {
    return this.raw.flags ?? this.raw.public_flags ?? 0;
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
