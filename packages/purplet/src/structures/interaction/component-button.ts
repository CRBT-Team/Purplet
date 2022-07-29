import type { APIInteraction, APIMessageComponentButtonInteraction} from 'purplet/types';
import { ComponentType } from 'purplet/types';
import { ComponentInteraction } from './component';
import { createInstanceofGuard } from '../../utils/class';

export class ButtonInteraction<
  Data extends APIMessageComponentButtonInteraction = APIMessageComponentButtonInteraction
> extends ComponentInteraction<Data> {
  static is = createInstanceofGuard(ButtonInteraction);

  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIMessageComponentButtonInteraction {
    return ComponentInteraction.matches(raw) && raw.data.component_type === ComponentType.Button;
  }
}
