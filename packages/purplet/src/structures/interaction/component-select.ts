import {
  APIInteraction,
  APIMessageComponentSelectMenuInteraction,
  ComponentType,
  SelectMenuInteraction,
} from 'discord.js';
import { PurpletComponentInteraction } from './component';
import { djs } from '../../lib/global';

export class PurpletSelectMenuInteraction<
  Data extends APIMessageComponentSelectMenuInteraction = APIMessageComponentSelectMenuInteraction
> extends PurpletComponentInteraction<Data> {
  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIMessageComponentSelectMenuInteraction {
    return (
      PurpletComponentInteraction.matches(raw) &&
      raw.data.component_type === ComponentType.SelectMenu
    );
  }

  get values() {
    return this.raw.data.values;
  }

  toDJS() {
    // @ts-expect-error Discord.js marks this with wrong types.
    return new SelectMenuInteraction(djs, this.raw);
  }
}
