import {
  APIInteraction,
  APIInteractionResponseCallbackData,
  InteractionResponseType,
} from 'discord.js';
import { PurpletInteraction } from './base';
import type { JSONResolvable } from '../../utils/plain';

/** An interaction that can be responded to with `CHANNEL_MESSAGE_WITH_SOURCE` */
export abstract class PurpletChannelInteraction<
  Data extends APIInteraction = APIInteraction
> extends PurpletInteraction<Data> {
  /**
   * Respond to this interaction with a message.
   *
   * **Response functions can only be called once per interaction.**
   */
  showMessage(message: JSONResolvable<APIInteractionResponseCallbackData>) {
    this.respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: message,
    });
    // TODO: return an interaction repsonse object.
  }

  deferMessage(message: JSONResolvable<APIInteractionResponseCallbackData>) {
    this.respond({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: message,
    });
    // TODO: return an interaction repsonse object.
  }
}
