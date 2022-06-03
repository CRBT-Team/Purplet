import {
  APIInteraction,
  APIMessageComponentSelectMenuInteraction,
  ComponentType,
} from 'discord-api-types/v10';
import { ComponentInteraction } from './component';

export class SelectMenuInteraction<
  Data extends APIMessageComponentSelectMenuInteraction = APIMessageComponentSelectMenuInteraction
> extends ComponentInteraction<Data> {
  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIMessageComponentSelectMenuInteraction {
    return (
      ComponentInteraction.matches(raw) && raw.data.component_type === ComponentType.SelectMenu
    );
  }

  get values() {
    return this.raw.data.values;
  }
}
