import {
  APIInteraction,
  APIInteractionResponseCallbackData,
  InteractionResponseType,
  MessageFlags,
} from 'discord.js';
import { PurpletInteraction } from './base';
import { PurpletOriginalInteractionMessagePartial } from '../interaction-resposne';
import type { JSONResolvable } from '../../../utils/plain';

export interface DeferMessageOptions {
  ephemeral?: boolean;
}

/** An interaction that can be responded to with `CHANNEL_MESSAGE_WITH_SOURCE` */
export abstract class PurpletChannelInteraction<
  Data extends APIInteraction = APIInteraction
> extends PurpletInteraction<Data> {
  /**
   * Respond to this interaction with a message.
   *
   * **Response functions can only be called once per interaction.**
   */
  // TODO: use a custom structure instead, to allow easy message flags and attachments.
  async showMessage(
    message: JSONResolvable<APIInteractionResponseCallbackData>
  ): Promise<PurpletOriginalInteractionMessagePartial> {
    await this.respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: message,
    });
    return new PurpletOriginalInteractionMessagePartial(this);
  }

  async deferMessage(options?: DeferMessageOptions) {
    // Note: ephemeral is the only thing we can use (well so can suppress embeds, but can't we set those when we edit?)
    await this.respond({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: {
        flags: options?.ephemeral ? MessageFlags.Ephemeral : 0,
      },
    });
    return new PurpletOriginalInteractionMessagePartial(this);
  }
}
