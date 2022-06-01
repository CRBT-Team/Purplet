import { APIInteraction, APIMessageComponentInteraction, InteractionType } from 'discord.js';
import { PurpletChannelInteraction } from './base-channel';

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
}
