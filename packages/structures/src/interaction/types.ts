import type { Immutable } from '@paperdave/utils';
import type { JSONResolvable } from '@purplet/utils';
import type {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteraction,
  APIApplicationCommandOptionChoice,
  APIChatInputApplicationCommandInteraction,
  APIInteraction,
  APIMessageApplicationCommandInteraction,
  APIMessageComponentButtonInteraction,
  APIMessageComponentInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIModalInteractionResponseCallbackData,
  APIModalSubmitInteraction,
  APIPingInteraction,
  APIUserApplicationCommandInteraction,
  ApplicationCommandType,
  ComponentType,
  InteractionType,
  Snowflake,
} from 'discord-api-types/v10';
import type { ReadonlyPermissionsBitfield } from '../bitfield';

/**
 * Internal base interface for all interactions. Do not use this type directly, use
 * {@link Interaction} instead.
 *
 * @privateRemarks
 * All interaction interfaces extend a "Base" interfaces, but then they are exported as a union
 * without the Base prefix. this lets us use discriminated unions to narrow types, while still being
 * able to use a heirarchy of "classes". The actual implementation is done in a single class
 * {@link ./interaction-impl.ts}, with these types acting as a giant type guard.
 */
export interface BaseInteraction {
  /**
   * Type of interaction. Use this value to narrow the TS type via
   * {@link https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions Discriminated Unions}.
   *
   * Copied directly from the `type` field on the
   * {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure Raw Interaction Object}
   */
  readonly type: InteractionType;

  /**
   * ID of the application this interaction is for.
   *
   * Copied directly from the `application_id` field on the
   * {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure Raw Interaction Object}
   */
  readonly applicationId: Snowflake;
  /**
   * Bitfield object of permissions the app or bot has within the channel the interaction was sent from.
   *
   * Based on the `app_permissions` field on the
   * {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure Raw Interaction Object}
   */
  readonly appPermissions: ReadonlyPermissionsBitfield;
  /**
   * Guild that the interaction was sent from.
   *
   * Based on the `guild_id` field on the
   * {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure Raw Interaction Object}
   *
   * TODO: Guild.
   */
  readonly guild: never;
  /**
   * Guild's preferred locale, if invoked in a guild.
   *
   * Copied directly from the `guild_locale` field on the
   * {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure Raw Interaction Object}
   */
  readonly guildLocale: string;
  /**
   * Selected language of the invoking user.
   *
   * Copied directly from the `locale` field on the
   * {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure Raw Interaction Object}
   */
  readonly locale: string;
  /**
   * ID of the interaction.
   *
   * Copied directly from the `id` field on the
   * {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure Discord API}.
   */
  readonly id: Snowflake;
  /**
   * Guild member of the invoking user, including their permissions.
   *
   * Based on from the `member` field on the
   * {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure Raw Interaction Object}
   *
   * TODO: Member.
   */
  readonly member: never;
  /**
   * Continuation token for responding to the interaction.
   *
   * Copied directly from the `token` field on the
   * {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure Raw Interaction Object}
   */
  readonly token: string;
  /**
   * User that invoked the interaction.
   *
   * Based on the `user` field on the
   * {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure Raw Interaction Object}
   * if the interaction was in a DM, or the `user` field on the `member` object if the interaction
   * was in a guild.
   */
  readonly user: never;
  /** Whether the interaction has been replied to already. */
  readonly replied: boolean;
  /**
   * The underlying
   * {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure Interaction Object}.
   */
  readonly raw: Immutable<APIInteraction>;
}

/**
 * Represents a
 * {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type Discord PING interaction}.
 * The only valid response is to ACK the interaction with {@link pong()}.
 */
export interface PingInteraction extends BaseInteraction {
  readonly type: InteractionType.Ping;

  /**
   * Respond to this interaction with a pong. This is the only valid response to a ping interaction.
   *
   * **Response functions can only be called once per interaction.**
   */
  pong(): void;

  readonly raw: Immutable<APIPingInteraction>;
}

export interface CommandResolvedClasses {
  /** TODO: User. */
  users: never;
  /** TODO: Role. */
  roles: never;
  /** TODO: Member. */
  members: never;
  /** TODO: Channel. */
  channels: never;
  /** TODO: Attachment. */
  attachments: never;
  /** TODO: Message. */
  messages: never;
}

export interface BaseCommandInteraction
  extends BaseInteraction,
    ShowMessageResponseHandlers,
    ShowModalResponseHandlers {
  readonly type: InteractionType.ApplicationCommand;
  readonly commandType: ApplicationCommandType;

  /** TODO: Channel. */
  readonly channel: never;
  readonly commandName: string;

  getResolved<T extends keyof CommandResolvedClasses>(
    type: T,
    id: Snowflake
  ): CommandResolvedClasses[T] | null;

  readonly raw: Immutable<APIApplicationCommandInteraction>;
}

export interface BaseContextCommandInteraction extends BaseCommandInteraction {
  readonly targetId: Snowflake;
}

export interface UserCommandInteraction extends BaseContextCommandInteraction {
  readonly commandType: ApplicationCommandType.User;
  /** TODO: Member, User. */
  readonly target: never | never;
  /** TODO: User. */
  readonly targetUser: never;
  /** TODO: Member. */
  readonly targetMember: never;

  readonly raw: Immutable<APIUserApplicationCommandInteraction>;
}

export interface MessageCommandInteraction extends BaseContextCommandInteraction {
  readonly commandType: ApplicationCommandType.Message;
  /** TODO: Message. */
  readonly target: never;

  readonly raw: Immutable<APIMessageApplicationCommandInteraction>;
}

export type ContextCommandInteraction = UserCommandInteraction | MessageCommandInteraction;

export interface SlashCommandInteraction extends BaseCommandInteraction {
  readonly commandType: ApplicationCommandType.ChatInput;

  /** TODO: SlashCommandInteraction.options. */
  readonly options: never;

  readonly subcommandName: string;
  readonly subcommandGroupName: string;
  readonly fullName: string;

  readonly raw: Immutable<APIChatInputApplicationCommandInteraction>;
}

export type CommandInteraction = SlashCommandInteraction | ContextCommandInteraction;

export interface AutocompleteInteraction
  extends BaseInteraction,
    Pick<
      SlashCommandInteraction,
      'commandName' | 'commandType' | 'subcommandName' | 'subcommandGroupName' | 'fullName'
    > {
  readonly type: InteractionType.ApplicationCommandAutocomplete;

  /** TODO: AutocompleteInteraction.options. */
  readonly options: never;
  /** TODO: AutocompleteInteraction.focusedOption. */
  readonly focusedOption: never;

  /**
   * Responds with autocomplete options. Corresponds to the
   * `APPLICATION_COMMAND_AUTOCOMPLETE_RESULT` interaction response type. This does not return any data.
   *
   * You typically want to use `OptionBuilder`'s `autocomplete` property, and return data there,
   * instead of manually calling this function.
   *
   * **Response functions can only be called once per interaction.**
   */
  showAutocompleteResponse(choices: JSONResolvable<APIApplicationCommandOptionChoice[]>): void;

  readonly raw: Immutable<APIApplicationCommandAutocompleteInteraction>;
}

export interface BaseComponentInteraction
  extends BaseInteraction,
    ShowMessageResponseHandlers,
    UpdateMessageResponseHandlers,
    ShowModalResponseHandlers {
  readonly type: InteractionType.MessageComponent;
  readonly componentType: ComponentType;

  /** TODO: Message. */
  readonly message: never;
  readonly customId: string;

  readonly raw: Immutable<APIMessageComponentInteraction>;
}

export interface ButtonInteraction extends BaseComponentInteraction {
  readonly componentType: ComponentType.Button;
  /** TODO: ButtonComponent. */
  readonly component: never;

  readonly raw: Immutable<APIMessageComponentButtonInteraction>;
}

export interface SelectMenuInteraction extends BaseComponentInteraction {
  readonly componentType: ComponentType.Button;
  /** TODO: SelectMenuComponent. */
  readonly component: never;
  readonly values: readonly string[];

  readonly raw: Immutable<APIMessageComponentSelectMenuInteraction>;
}

export type ComponentInteraction = ButtonInteraction | SelectMenuInteraction;

/**
 * @privateRemarks
 * TECHNICALLY, these `UpdateMessageResponseHandlers` are allowed, but it depends on what
 * interaction came before the modal submit interaction.
 */
export interface ModalSubmitInteraction
  extends BaseInteraction,
    ShowMessageResponseHandlers,
    UpdateMessageResponseHandlers {
  readonly type: InteractionType.ModalSubmit;
  readonly customId: string;

  readonly raw: Immutable<APIModalSubmitInteraction>;
}

export type Interaction =
  | PingInteraction
  | CommandInteraction
  | AutocompleteInteraction
  | ComponentInteraction
  | ModalSubmitInteraction;

/** Options for `Interaction.deferMessage` */
export interface DeferMessageOptions {
  ephemeral?: boolean;
}

/*
 * Since the rules of what response types are valid for each interaction type are really weird,
 * response functions are typed in these three interfaces, and then merged into the main
 * `Interaction` interface:
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type.
 *
 * Mini rant: These docs aren't even fully accurate because it says BS like "`MODAL` is not
 * available for MODAL_SUBMIT and PING interactions", as if `PING` interactions support anything
 * besides `PONG`? Aren't `PING` interactions only supposed to be `PONG`'d. Also, `UPDATE_MESSAGE`
 * is technically valid on a `MODAL_SUBMIT`, but only if it was previously from a component. That is
 * IMPOSSIBLE to type. anyways i think mixins is the best solution we have for the wacky typings.
 *
 * Oh also while im on the topic who came up with `DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE`? i mean it
 * makes sense, but that is a really long name lol.
 */
export interface ShowMessageResponseHandlers {
  /**
   * Respond to this interaction with a message. Corresponds to the `CHANNEL_MESSAGE_WITH_SOURCE`
   * interaction response type.
   *
   * **Response functions can only be called once per interaction.**
   */
  // TODO: Message
  showMessage(message: CreateInteractionMessageData): never;

  /**
   * Defer the resposne to this interaction; sending a message with a loading indicator. Corresponds
   * to the `DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE` interaction response type. Returns the message
   * that was sent, and that must be used to create your actual response.
   *
   * **Response functions can only be called once per interaction.**
   */
  // TODO: Message
  deferMessage(options?: DeferMessageOptions): never;
}

export interface UpdateMessageResponseHandlers {
  /**
   * Respond to this interaction by updating the message that the targeted component is on.
   * Corresponds to the `UPDATE_MESSAGE` interaction response type. This is only valid for
   * interactions that started from interacting with a message component.
   *
   * **Response functions can only be called once per interaction.**
   */
  // TODO: Message
  updateMessage(message: CreateInteractionMessageData): never;

  /**
   * Defer the resposne to this interaction; Does not show a loading indicator, but tells Discord
   * that we acknowledged the interaction. Corresponds to the `DEFERRED_UPDATE_MESSAGE` interaction
   * response type. Returns the message that was sent, and that must be used to create your actual response.
   *
   * **Response functions can only be called once per interaction.**
   */
  // TODO: Message
  deferUpdateMessage(options?: DeferMessageOptions): never;
}

export interface ShowModalResponseHandlers {
  /**
   * Shows a modal form to the user. Corresponds to the `MODAL` interaction response type. This does
   * not return any data, and the modal submit is handled as a separate interaction. If you need to
   * pass data from before and after the modal, use purplet's `$modal` hook.
   *
   * **Response functions can only be called once per interaction.**
   */
  showModal(modal: JSONResolvable<APIModalInteractionResponseCallbackData>): void;
}
