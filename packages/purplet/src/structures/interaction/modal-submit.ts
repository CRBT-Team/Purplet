import type {
  APIInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIModalSubmitInteraction} from 'purplet/types';
import {
  ComponentType,
  InteractionType,
} from 'purplet/types';
import { Interaction } from './base';
import type {
  InteractionResponseMixin} from './response';
import {
  applyInteractionResponseMixins,
  createInteractionMixinList
} from './response';
import { createInstanceofGuard } from '../../utils/class';

export class ModalSubmitInteraction<
  Data extends APIModalSubmitInteraction = APIModalSubmitInteraction
> extends Interaction<Data> {
  static is = createInstanceofGuard(ModalSubmitInteraction);

  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIMessageComponentSelectMenuInteraction {
    return raw.type === InteractionType.ModalSubmit;
  }

  get customId() {
    return this.raw.data.custom_id;
  }

  get components() {
    // discord-api-types marks this as optional, but i'm not sure how. either way let's
    // add this fallback to it.
    return this.raw.data.components ?? [];
  }

  getComponent(customId: string) {
    if (!this.raw.data.components) {
      return null;
    }

    for (const row of this.raw.data.components) {
      for (const component of row.components) {
        if (component.custom_id === customId) {
          return component;
        }
      }
    }

    return null;
  }

  getTextFieldValue(customId: string) {
    const comp = this.getComponent(customId);
    if (!comp || comp.type !== ComponentType.TextInput) {
      return null;
    }
    return comp.value;
  }
}

// Mixin the response methods.
const allowedMethods = createInteractionMixinList([
  //
  'showMessage',
  'deferMessage',
  /**
   * TECHNICALLY, these two methods are allowed, but it depends on what interaction came before the
   * modal submit interaction.
   */
  'updateMessage',
  'deferUpdateMessage',
]);

applyInteractionResponseMixins(ModalSubmitInteraction, allowedMethods);
export type ModalSubmitInteraction = InteractionResponseMixin<typeof allowedMethods>
