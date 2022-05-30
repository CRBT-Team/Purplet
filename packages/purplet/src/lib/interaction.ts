import type { APIInteraction, APIInteractionResponse } from 'discord.js';

export type InteractionResponseHandler<Data extends APIInteractionResponse> = (r: Data) => void;

export class PurpletInteraction<Response extends APIInteractionResponse = APIInteractionResponse> {
  #onRespond: InteractionResponseHandler<Response> | undefined;

  constructor(public data: APIInteraction, onRespond?: InteractionResponseHandler<Response>) {
    this.#onRespond = onRespond;
  }

  get applicationId() {
    return this.data.application_id;
  }

  get channelId() {
    return this.data.channel_id;
  }

  get guildId() {
    return this.data.guild_id;
  }

  get guildLocale() {
    return this.data.guild_locale;
  }

  get id() {
    return this.data.id;
  }

  get member() {
    return this.data.member;
  }

  get message() {
    return this.data.message;
  }

  get token() {
    return this.data.token;
  }

  get type() {
    return this.data.type;
  }

  get user() {
    return this.data.user;
  }

  respond(response: Response) {
    if (this.#onRespond) {
      this.#onRespond(response);
    } else {
      throw new Error('No response handler set');
    }
  }

  /** Resolves to either `.member` or `.user` depending which one is filled in. */
  get invoker() {
    // The null assert ensures that the type is APIMember | APIUser, but excluding null.
    return this.member ?? this.user!;
  }
}
