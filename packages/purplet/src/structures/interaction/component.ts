import type { APIInteraction, APIMessageComponentInteraction} from 'purplet/types';
import { InteractionType } from 'purplet/types';
import { Interaction } from './base';
import type {
  InteractionResponseMixin} from './response';
import {
  applyInteractionResponseMixins,
  createInteractionMixinList
} from './response';
import { createInstanceofGuard } from '../../utils/class';

export abstract class ComponentInteraction<
  Data extends APIMessageComponentInteraction = APIMessageComponentInteraction
> extends Interaction<Data> {
  static is = createInstanceofGuard<ComponentInteraction>(ComponentInteraction as any);

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
export type ComponentInteraction = InteractionResponseMixin<typeof allowedMethods>
