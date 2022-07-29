import type {
  APIInteraction,
  APIMessageComponentSelectMenuInteraction} from 'purplet/types';
import {
  ComponentType,
} from 'purplet/types';
import { ComponentInteraction } from './component';
import { createInstanceofGuard } from '../../utils/class';

export class SelectMenuInteraction<
  Data extends APIMessageComponentSelectMenuInteraction = APIMessageComponentSelectMenuInteraction
> extends ComponentInteraction<Data> {
  static is = createInstanceofGuard(SelectMenuInteraction);

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
