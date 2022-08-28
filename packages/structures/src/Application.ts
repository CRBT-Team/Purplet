import type {
  APIApplication,
  APIApplicationInstallParams,
  APITeam,
  APITeamMember,
  APIUser,
  OAuth2Scopes,
} from 'discord-api-types/v10';
import { TeamMemberMembershipState } from 'discord-api-types/v10';
import { Base } from './Base';
import { ApplicationFlagsBitfield, PermissionsBitfield } from './Bitfield';
import { User } from './User';

export class Application extends Base<APIApplication> {
  protected get Class() {
    return this.constructor as typeof Application;
  }

  // Properties
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  rpcOrigins: string[];
  isPublic: boolean;
  isRequireCodeGrant: boolean;
  termsOfService: string | null;
  privacyPolicy: string | null;
  verifyKey: string;
  guildId: string | null;
  primarySkuId: string | null;
  slug: string | null;
  coverImage: string | null;
  tags: string[];
  customInstallUrl: string | null;

  constructor(raw: APIApplication) {
    super(raw);

    this.id = raw.id;
    this.name = raw.name;
    this.icon = raw.icon ?? null;
    this.description = raw.description ?? null;
    this.rpcOrigins = raw.rpc_origins ?? [];
    this.isPublic = raw.bot_public;
    this.isRequireCodeGrant = raw.bot_require_code_grant;
    this.termsOfService = raw.terms_of_service_url ?? null;
    this.privacyPolicy = raw.privacy_policy_url ?? null;
    this.verifyKey = raw.verify_key;
    this.guildId = raw.guild_id ?? null;
    this.primarySkuId = raw.primary_sku_id ?? null;
    this.slug = raw.slug ?? null;
    this.coverImage = raw.cover_image ?? null;
    this.tags = (raw.tags ?? []) as string[];
    this.customInstallUrl = raw.custom_install_url ?? null;
  }

  // Getters
  get owner() {
    return new User(
      this.raw.owner
        ? this.raw.owner
        : this.raw.team!.members.find(x => x.user.id === this.raw.team!.owner_user_id)!.user
    );
  }
  get team() {
    return this.raw.team ? new Team(this.raw.team) : null;
  }
  get teamMembers() {
    return this.raw.owner ? [new TeamMemberNotInATeamUser(this.raw.owner)] : this.team!.members;
  }
  get flags(): ApplicationFlagsBitfield {
    return new ApplicationFlagsBitfield(this.raw.flags);
  }
  get installParams(): ApplicationInstallParams | null {
    return this.raw.install_params ? new ApplicationInstallParams(this.raw.install_params) : null;
  }

  static async fetch() {
    return new this(
      (await this.rest.oauth2.getCurrentBotApplicationInformation()) as APIApplication
    );
  }
}

export class ApplicationInstallParams extends Base<APIApplicationInstallParams> {
  protected get Class() {
    return this.constructor as typeof Application;
  }

  // Properties
  scopes: OAuth2Scopes[];
  permissions: PermissionsBitfield;

  constructor(raw: APIApplicationInstallParams) {
    super(raw);

    this.scopes = raw.scopes ?? [];
    this.permissions = new PermissionsBitfield(raw.permissions);
  }
}

export class Team extends Base<APITeam> {
  protected get Class() {
    return this.constructor as typeof Team;
  }

  icon: string | null;
  id: string;
  name: string;

  constructor(raw: APITeam) {
    super(raw);

    this.icon = raw.icon ?? null;
    this.id = raw.id;
    this.name = raw.name;
  }

  get owner() {
    return new User(this.raw.members.find(x => x.user.id === this.raw.owner_user_id)!.user);
  }

  get members() {
    return this.raw.members.map(x => new TeamMemberUser(x.user, x, this));
  }
}

export class TeamMemberUser extends User {
  membershipState: TeamMemberMembershipState;
  // TODO: when api gets real member permissions, we should add it.
  // permissions: ['*']

  constructor(user: APIUser, private readonly rawTeamMember: APITeamMember, readonly team: Team) {
    super(user);

    this.membershipState = rawTeamMember.membership_state;
  }
}

/** I apolgize for not naming this anything nicer. */
class TeamMemberNotInATeamUser extends User {
  // Properties
  membershipState: TeamMemberMembershipState;

  constructor(user: APIUser) {
    super(user);

    this.membershipState = TeamMemberMembershipState.Accepted;
  }

  // Getters
  get team() {
    return new Team({
      id: this.id,
      name: this.tag,
      owner_user_id: this.id,
      icon: null,
      members: [
        {
          user: this.raw,
          membership_state: TeamMemberMembershipState.Accepted,
          permissions: ['*'],
          team_id: this.id,
        },
      ],
    });
  }
}
