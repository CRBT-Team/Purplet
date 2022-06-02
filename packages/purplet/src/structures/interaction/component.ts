import { APIInteraction, APIMessageComponentInteraction, InteractionType } from 'discord.js';
import { PurpletInteraction } from './base';
import {
  applyInteractionResponseMixins,
  createInteractionMixinList,
  InteractionResponseMixin,
} from './response';

export abstract class PurpletComponentInteraction<
  Data extends APIMessageComponentInteraction = APIMessageComponentInteraction
> extends PurpletInteraction<Data> {
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

// Mixin the response methods.
const allowedMethods = createInteractionMixinList([
  //
  'showMessage',
  'deferMessage',
  'updateMessage',
  'deferUpdateMessage',
  'showModal',
]);

applyInteractionResponseMixins(PurpletComponentInteraction, allowedMethods);
export interface PurpletComponentInteraction
  extends InteractionResponseMixin<typeof allowedMethods> {}
