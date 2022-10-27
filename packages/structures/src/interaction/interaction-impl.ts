import type { ForceSimplify } from '@paperdave/utils';
import type { RawFile } from '@purplet/rest';
import type { JSONResolvable } from '@purplet/utils';
import { toJSONValue } from '@purplet/utils';
import type {
  APIApplicationCommandInteraction,
  APIApplicationCommandOptionChoice,
  APIChatInputApplicationCommandInteractionData,
  APIContextMenuInteraction,
  APIInteraction,
  APIInteractionResponse,
  APIMessageComponentInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIModalInteractionResponseCallbackData,
  ComponentType,
  Snowflake,
} from 'discord-api-types/v10';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from 'discord-api-types/v10';
import type {
  AutocompleteInteraction,
  ButtonInteraction,
  DeferMessageOptions,
  Interaction as InteractionUnionType,
  MessageCommandInteraction,
  ModalSubmitInteraction,
  PingInteraction,
  SelectMenuInteraction,
  SlashCommandInteraction,
  UserCommandInteraction,
} from './types';
import { Base } from '../base';
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

class InteractionImpl extends Base implements InteractionIntersection {
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
    super();
    this.type = raw.type;
    this.applicationId = raw.application_id;
    this.guildLocale = raw.guild_locale!;
    this.locale = (raw as any).locale;
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
    this.onRespond(toJSONValue(response));
  }

  // Cached Computed Properties

  /** Implementation of {@link BaseInteraction#appPermissions} */
  get appPermissions() {
    return this.cached('appPermissions', new ReadonlyPermissionsBitfield(this.raw.app_permissions));
  }

  /** Implementation of {@link BaseInteraction#guild}. */
  get guild() {
    return this.todo('guild');
  }

  /** Implementation of {@link BaseInteraction#member}. */
  get member() {
    return this.todo('member');
  }

  /** Implementation of {@link BaseInteraction#user}. */
  get user() {
    return this.todo('user');
  }

  /** Implementation of {@link BaseCommandInteraction#channel}. */
  get channel() {
    return this.todo('channel');
  }

  /** Implementation of {@link UserCommandInteraction#target} and {@link MessageCommandInteraction#target}. */
  get target() {
    if (this.commandType === ApplicationCommandType.User) {
      return this.todo('target as User|Member');
    } else if (this.commandType === ApplicationCommandType.Message) {
      return this.todo('target as Message');
    }
    throw new TypeError('target is only available on ContextCommandInteraction');
  }

  /** Implementation of {@link UserCommandInteraction#targetUser}. */
  get targetUser() {
    return this.todo('targetUser');
  }

  /** Implementation of {@link UserCommandInteraction#targetUser}. */
  get targetMember() {
    return this.todo('targetUser');
  }

  /** Implementation of {@link SlashCommandInteraction#options} and {@link AutocompleteInteraction#options}. */
  get options() {
    if (this.type === InteractionType.ApplicationCommand) {
      return this.todo('options as SlashCommandInteractionOptions');
    } else if (this.type === InteractionType.ApplicationCommandAutocomplete) {
      return this.todo('options as AutocompleteInteractionOptions');
    }
    throw new TypeError(
      'options is only available on SlashCommandInteraction and AutocompleteInteraction'
    );
  }

  /** Implementation of {@link SlashCommandInteraction#subcommandName}. */
  get subcommandName() {
    const data = this.raw.data as APIChatInputApplicationCommandInteractionData;

    const type = data.options?.[0]?.type;
    return this.cached(
      'subcommandName',
      type === ApplicationCommandOptionType.Subcommand
        ? data.options![0].name
        : type === ApplicationCommandOptionType.SubcommandGroup
        ? data.options![0].options![0].name
        : null
    );
  }

  /** Implementation of {@link SlashCommandInteraction#subcommandGroupName}. */
  get subcommandGroupName() {
    const data = this.raw.data as APIChatInputApplicationCommandInteractionData;
    return this.cached(
      'subcommandGroupName',
      (data.options &&
        data.options[0]?.type === ApplicationCommandOptionType.SubcommandGroup &&
        data.options[0].name) ??
        null
    );
  }

  /** Implementation of {@link SlashCommandInteraction#fullCommandName}. */
  get fullCommandName() {
    return [this.commandName, this.subcommandGroupName, this.subcommandName]
      .filter(Boolean)
      .join(' ');
  }

  /** Implementation of {@link BaseComponentInteraction#message}. */
  get message() {
    return this.todo('message');
  }

  /** Implementation of {@link BaseComponentInteraction#component}. */
  get component() {
    const raw = this.raw as APIMessageComponentInteraction;
    for (const row of raw.message.components!) {
      for (const component of row.components) {
        if ((component as any).custom_id === this.customId) {
          return this.todo('convert APIComponent to a component class');
        }
      }
    }
    throw new Error('Could not find Interacted Component in the message (should never happen)');
  }

  // Interaction Response Methods

  pong(): void {
    this._respond({
      json: {
        type: InteractionResponseType.Pong,
      },
    });
  }

  showMessage(message: CreateInteractionMessageData) {
    const { message: data, files } = resolveCreateInteractionMessageData(message);
    this._respond({
      json: {
        type: InteractionResponseType.ChannelMessageWithSource,
        data,
      },
      files,
    });
    return null as never;
  }

  deferMessage(options?: DeferMessageOptions) {
    // Note: ephemeral is the only thing we can use (well so can suppress embeds, but can't we set those when we edit?)
    this._respond({
      json: {
        type: InteractionResponseType.DeferredChannelMessageWithSource,
        data: {
          flags: options?.ephemeral ? MessageFlags.Ephemeral : 0,
        },
      },
    });
    return null as never;
  }

  updateMessage(message: CreateInteractionMessageData) {
    const { message: data, files } = resolveCreateInteractionMessageData(message);
    this._respond({
      json: {
        type: InteractionResponseType.UpdateMessage,
        data,
      },
      files,
    });
    return null as never;
  }

  deferUpdateMessage() {
    this._respond({
      json: {
        type: InteractionResponseType.DeferredMessageUpdate,
      },
    });
    return null as never;
  }

  showAutocompleteResponse(choices: JSONResolvable<APIApplicationCommandOptionChoice[]>) {
    this._respond({
      json: {
        type: InteractionResponseType.ApplicationCommandAutocompleteResult,
        data: {
          choices: toJSONValue(choices),
        },
      },
    });
  }

  showModal(modal: JSONResolvable<APIModalInteractionResponseCallbackData>) {
    this._respond({
      json: {
        type: InteractionResponseType.Modal,
        data: toJSONValue(modal),
      },
    });
  }
}

export type InteractionConstructor = new (
  raw: APIInteraction,
  onRespond: InteractionResponseHandler
) => InteractionUnionType;

export const Interaction = InteractionImpl as any as InteractionConstructor;
export type Interaction = InteractionUnionType;
