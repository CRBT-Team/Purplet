import type { Awaitable } from '@davecode/types';
import type {
  APIInteraction,
  APIInteractionResponse,
  APIPingInteraction,
} from 'discord-api-types/v10';
import { InteractionExecutingUser } from '../user';
import { JSONResolvable, toJSONValue } from '../../utils/plain';

export type InteractionResponseHandler = (r: APIInteractionResponse) => Awaitable<void>;

export type APINonPingInteraction = Exclude<APIInteraction, APIPingInteraction>;

export abstract class Interaction<Data extends APINonPingInteraction = APINonPingInteraction> {
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
    return this.raw.guild_locale ?? this.raw.locale;
  }

  get locale() {
    return this.raw.locale ?? this.raw.guild_locale;
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

  get user(): InteractionExecutingUser {
    return new InteractionExecutingUser(this.raw.user ?? this.member!.user, this);
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
}
