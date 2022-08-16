import type { APIConnection, APIUser, UserPremiumType } from 'discord-api-types/v10';
import { Base } from './Base';
import { UserFlagsBitfield } from './Bitfield';

export enum HypesquadHouse {
  Bravery = 'bravery',
  Brilliance = 'brilliance',
  Balance = 'balance',
}

export class User extends Base<APIUser> {
  protected get Class() {
    return this.constructor as typeof User;
  }

  // Properties
  id: string;
  username: string;
  discriminator: string;
  avatarHash: string | null;
  bannerHash: string | null;
  accentColor: number | null;
  bannerColor: string | null;
  isBot: boolean;

  constructor(raw: APIUser) {
    super(raw);

    this.id = raw.id;
    this.username = raw.username;
    this.discriminator = raw.discriminator;
    this.avatarHash = raw.avatar ?? null;
    this.bannerHash = raw.banner ?? null;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this.isBot = (raw.bot || raw.system) ?? false;
    this.accentColor = raw.accent_color ?? null;
    // @ts-expect-error Missing from discord-api-types???
    this.bannerColor = raw.banner_color ?? null;
  }

  // Getters
  get flags(): UserFlagsBitfield {
    return new UserFlagsBitfield(this.raw.flags ?? this.raw.public_flags);
  }

  get tag() {
    return `${this.username}#${this.discriminator}`;
  }

  get hypesquadHouse() {
    const flags = this.flags;
    return flags.hasHypeSquadOnlineHouse1
      ? HypesquadHouse.Bravery
      : flags.hasHypeSquadOnlineHouse2
      ? HypesquadHouse.Brilliance
      : flags.hasHypeSquadOnlineHouse3
      ? HypesquadHouse.Balance
      : null;
  }

  // Methods
  static async fetch(userId: string) {
    return new this(await this.rest.user.getUser({ userId }));
  }

  async fetch() {
    return this.Class.fetch(this.id);
  }

  createDM(): never {
    throw new Error('TODO: Structure for DM');
    // const dm = await this.rest.user.createDM({
    //   body: {
    //     recipient_id: this.id,
    //   },
    // });
  }
}

export class OAuthUser extends User {
  // Properties
  isMFAEnabled: boolean;
  locale: string;
  isEmailVerified: boolean;
  email: string;
  premiumType: UserPremiumType;

  constructor(raw: APIUser) {
    super(raw);

    this.isMFAEnabled = raw.mfa_enabled ?? false;
    this.locale = raw.locale ?? '';
    this.isEmailVerified = raw.verified ?? false;
    this.email = raw.email ?? '';
    this.premiumType = raw.premium_type ?? 0;
  }

  // Methods
  async fetchConnections(): Promise<APIConnection[]> {
    return this.rest.user.getUserConnections({ userId: this.id });
  }
}

export interface ModifyCurrentUserData {
  username?: string;
  avatar?: string;
}

export class CurrentUser extends User {
  // Properties
  locale: string;

  constructor(raw: APIUser) {
    super(raw);

    this.locale = raw.locale ?? 'en-US';
  }

  // Methods
  static async fetch() {
    return new this(await this.rest.user.getCurrentUser());
  }

  fetchGuilds(): never {
    throw new Error('TODO: Structure for Guild');
    // await this.rest.user.getCurrentUserGuilds();
  }

  async modify(data: ModifyCurrentUserData) {
    // TODO: handle FileData and so on for `avatar`
    return new this.Class(await this.rest.user.modifyCurrentUser({ body: data }));
  }
}
