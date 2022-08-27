import type { APIApplication } from 'discord-api-types/v10';
import { Base } from './Base';
import { ApplicationFlagsBitfield } from './Bitfield';

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
  // owner
  verifyKey: string;
  // team
  guildId: string | null;
  primarySkuId: string | null;
  slug: string | null;
  coverImage: string | null;
  // flags: ApplicationFlagsBitfield
  tags: string[];
  customInstallUrl: string | null;
  // installParams: ApplicationInstallParams;

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
    return null;
  }
  get team() {
    return null;
  }
  get flags(): ApplicationFlagsBitfield {
    return new ApplicationFlagsBitfield(this.raw.flags);
  }
  get installParams(): ApplicationInstallParams {
    return null;
  }
}
