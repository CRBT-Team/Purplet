import type { ForceSimplify } from '@paperdave/utils';
import type { RawFile } from '@purplet/rest';
import type {
  APIApplicationCommandInteraction,
  APIContextMenuInteraction,
  APIInteraction,
  APIInteractionResponse,
  APIMessageComponentInteraction,
  APIMessageComponentSelectMenuInteraction,
  ApplicationCommandType,
  ComponentType,
  InteractionType,
  Snowflake,
} from 'discord-api-types/v10';
import type {
  AutocompleteInteraction,
  ButtonInteraction,
  Interaction,
  MessageCommandInteraction,
  ModalSubmitInteraction,
  PingInteraction,
  SelectMenuInteraction,
  SlashCommandInteraction,
  UserCommandInteraction,
} from './types';
import { ReadonlyPermissionsBitfield } from '../bitfield';

export type { RawFile };

export interface InteractionResponse {
  json: APIInteractionResponse;
  files?: RawFile[];
}

export type InteractionResponseHandler = (r: InteractionResponse) => void;

type OmitType<X> = Omit<X, 'type' | 'commandType' | 'componentType' | 'raw'>;

type InteractionIntersection = ForceSimplify<
  OmitType<PingInteraction> &
    OmitType<UserCommandInteraction> &
    OmitType<MessageCommandInteraction> &
    OmitType<SlashCommandInteraction> &
    OmitType<AutocompleteInteraction> &
    OmitType<ButtonInteraction> &
    OmitType<SelectMenuInteraction> &
    OmitType<ModalSubmitInteraction>
>;

class InteractionImpl implements InteractionIntersection {
  type: InteractionType;
  applicationId: Snowflake;
  guildLocale: string;
  locale: string;
  id: Snowflake;
  token: string;
  replied = false;
  targetId: Snowflake;
  commandName: string;
  commandType: ApplicationCommandType;
  componentType: ComponentType;
  customId: string;
  values: string[];

  constructor(public raw: APIInteraction, private onRespond: InteractionResponseHandler) {
    this.type = raw.type;
    this.applicationId = raw.application_id;
    this.guildLocale = raw.guild_locale!;
    this.locale = (raw.guild_locale ?? (raw.user ?? raw.member?.user)?.locale)!;
    this.id = raw.id;
    this.token = raw.token;
    this.customId = (raw as APIMessageComponentInteraction).data?.custom_id;
    this.values = (raw as APIMessageComponentSelectMenuInteraction).data?.values;
    this.targetId = (raw as APIContextMenuInteraction).data?.target_id;
    this.commandName = (raw as APIApplicationCommandInteraction).data?.name;
    this.commandType = (raw as APIApplicationCommandInteraction).data?.type;
    this.componentType = (raw as APIMessageComponentInteraction).data?.component_type;
  }

  private _respond(response: InteractionResponse) {
    if (this.replied) {
      throw new Error('Cannot respond to an interaction twice');
    }
    this.replied = true;
    this.onRespond(response);
  }

  /** Implementation of `BaseInteraction#appPermissions`. */
  get appPermissions() {
    return new ReadonlyPermissionsBitfield(this.raw.app_permissions);
  }
}

export function createInteraction(raw: APIInteraction, onRespond: InteractionResponseHandler) {
  return new InteractionImpl(raw, onRespond) as any as Interaction;
}
