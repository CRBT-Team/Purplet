import {
  APIInteraction,
  APIInteractionResponseCallbackData,
  APIMessageComponentInteraction,
  InteractionResponseType,
  InteractionType,
} from 'discord.js';
import { PurpletChannelInteraction } from './base-channel';
import type { JSONResolvable } from '../../../utils/plain';

export abstract class PurpletComponentInteraction<
  Data extends APIMessageComponentInteraction = APIMessageComponentInteraction
> extends PurpletChannelInteraction<Data> {
  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIMessageComponentInteraction {
    return raw.type === InteractionType.MessageComponent;
  }

  get message() {
    return this.raw.message;
  }

  get customId() {
    return this.raw.data.custom_id;
  }

  get componentType() {
    return this.raw.data.component_type;
  }

  /**
   * Respond to this interaction with a message.
   *
   * **Response functions can only be called once per interaction.**
   */
  // TODO: use a custom structure instead, to allow easy message flags and attachments.
  updateMessage(message: JSONResolvable<APIInteractionResponseCallbackData>) {
    this.respond({
      type: InteractionResponseType.UpdateMessage,
      data: message,
    });
    // TODO: return an interaction repsonse object.
  }

  deferUpdateMessage() {
    // Note: ephemeral is the only thing we can use (well so can suppress embeds, but can't we set those when we edit?)
    this.respond({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
    });
    // TODO: return an interaction repsonse object.
  }
}
