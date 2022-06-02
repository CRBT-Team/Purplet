import {
  APIInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIModalSubmitInteraction,
  ComponentType,
  InteractionType,
  ModalSubmitInteraction,
} from 'discord.js';
import { PurpletInteraction } from './base';
import {
  applyInteractionResponseMixins,
  createInteractionMixinList,
  InteractionResponseMixin,
} from './response';
import { djs } from '../../global';

export class PurpletModalSubmitInteraction<
  Data extends APIModalSubmitInteraction = APIModalSubmitInteraction
> extends PurpletInteraction<Data> {
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

  toDJS() {
    // @ts-expect-error Discord.js marks this with wrong types.
    return new ModalSubmitInteraction(djs, this.raw);
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

applyInteractionResponseMixins(PurpletModalSubmitInteraction, allowedMethods);
export interface PurpletModalSubmitInteraction
  extends InteractionResponseMixin<typeof allowedMethods> {}
