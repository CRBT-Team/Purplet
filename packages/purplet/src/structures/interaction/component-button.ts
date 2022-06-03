import {
  APIInteraction,
  APIMessageComponentButtonInteraction,
  ComponentType,
} from 'discord-api-types/v10';
import { ComponentInteraction } from './component';

export class ButtonInteraction<
  Data extends APIMessageComponentButtonInteraction = APIMessageComponentButtonInteraction
> extends ComponentInteraction<Data> {
  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIMessageComponentButtonInteraction {
    return ComponentInteraction.matches(raw) && raw.data.component_type === ComponentType.Button;
  }
}
