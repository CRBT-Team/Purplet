import type { Awaitable } from '@davecode/types';
import type { APIInteraction, APIInteractionResponse, Interaction } from 'discord.js';
import { JSONResolvable, toJSONValue } from '../../../utils/plain';

export type InteractionResponseHandler = (r: APIInteractionResponse) => Awaitable<void>;

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
    return this.raw.user ?? this.member!.user;
  }

  protected async respond(response: JSONResolvable<APIInteractionResponse>) {
    if (this.#replied) {
      throw new Error('Cannot respond to an interaction twice');
    }
    this.#replied = true;

    if (this.#onRespond) {
      await this.#onRespond(toJSONValue(response));
    } else {
      throw new Error(
        'This interaction cannot be responded to. (onRespond not set in constructor)'
      );
    }
  }

  get replied() {
    return this.#replied;
  }

  /**
   * Returns the Discord.js equivalent of this interaction. Not valid in cases where you are not
   * using Discord.js.
   */
  abstract toDJS(): Interaction;
}
