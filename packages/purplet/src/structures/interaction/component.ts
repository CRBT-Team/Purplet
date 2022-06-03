import {
  APIInteraction,
  APIMessageComponentInteraction,
  InteractionType,
} from 'discord-api-types/v10';
import { Interaction } from './base';
import {
  applyInteractionResponseMixins,
  createInteractionMixinList,
  InteractionResponseMixin,
} from './response';

export abstract class ComponentInteraction<
  Data extends APIMessageComponentInteraction = APIMessageComponentInteraction
> extends Interaction<Data> {
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

applyInteractionResponseMixins(ComponentInteraction, allowedMethods);
export interface ComponentInteraction extends InteractionResponseMixin<typeof allowedMethods> {}
