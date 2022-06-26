import type { Awaitable } from '@davecode/types';
import type {
  APIInteraction,
  APIInteractionResponse,
  APIPingInteraction,
} from 'discord-api-types/v10';
import { EmptyTextChannel } from '../channel';
import { EmptyGuild } from '../guild';
import { InteractionExecutingUser } from '../user';
import { createInstanceofGuard } from '../../utils/class';
import { JSONResolvable, toJSONValue } from '../../utils/plain';

export type InteractionResponseHandler = (r: APIInteractionResponse) => Awaitable<void>;

export type APINonPingInteraction = Exclude<APIInteraction, APIPingInteraction>;

export abstract class Interaction<Data extends APINonPingInteraction = APINonPingInteraction> {
  static is = createInstanceofGuard<Interaction>(Interaction as any);

  #onRespond: InteractionResponseHandler | undefined;
  #replied = false;

  constructor(public readonly raw: Data, onRespond?: InteractionResponseHandler) {
    this.#onRespond = onRespond;
  }

  get applicationId() {
    return this.raw.application_id;
  }

  get guild() {
    return this.raw.guild_id ? new EmptyGuild({ id: this.raw.guild_id }) : null;
  }

  get channel() {
    return this.raw.channel_id ? new EmptyTextChannel({ id: this.raw.channel_id }) : null;
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
