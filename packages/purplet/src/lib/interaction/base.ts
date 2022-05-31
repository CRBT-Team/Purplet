import type { APIInteraction, APIInteractionResponse, Interaction } from 'discord.js';

export type InteractionResponseHandler = (r: APIInteractionResponse) => void;

export abstract class PurpletInteraction<Data extends APIInteraction = APIInteraction> {
  #onRespond: InteractionResponseHandler | undefined;
  #replied = false;

  constructor(public readonly raw: Data, onRespond?: InteractionResponseHandler) {
    this.#onRespond = onRespond;
  }

  get applicationId() {
    return this.raw.application_id;
  }

  get guildId() {
    return this.raw.guild_id;
  }

  get guildLocale() {
    return this.raw.guild_locale;
  }

  get id() {
    return this.raw.id;
  }

  get member() {
    return this.raw.member;
  }

  get token() {
    return this.raw.token;
  }

  get type() {
    return this.raw.type;
  }

  get user() {
    return this.raw.user;
  }

  respond(response: APIInteractionResponse) {
    if (this.#replied) {
      throw new Error('Cannot respond to an interaction twice');
    }
    this.#replied = true;

    if (this.#onRespond) {
      this.#onRespond(response);
    } else {
      throw new Error(
        'This interaction cannot be responded to. (onRespond not set in constructor)'
      );
    }
  }

  get replied() {
    return this.#replied;
  }

  /** Resolves to either `.member` or `.user` depending which one is filled in. */
  get invoker() {
    // The null assert ensures that the type is APIMember | APIUser, but excluding null.
    return this.member ?? this.user!;
  }

  /**
   * Returns the Discord.js equivalent of this interaction. Not valid in cases where you are not
   * using Discord.js.
   */
  abstract toDJS(): Interaction;
}
