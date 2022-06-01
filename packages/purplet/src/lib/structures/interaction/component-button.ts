import {
  APIInteraction,
  APIMessageComponentButtonInteraction,
  ButtonInteraction,
  ComponentType,
} from 'discord.js';
import { PurpletComponentInteraction } from './component';

export class PurpletButtonInteraction<
  Data extends APIMessageComponentButtonInteraction = APIMessageComponentButtonInteraction
> extends PurpletComponentInteraction<Data> {
  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIMessageComponentButtonInteraction {
    return (
      PurpletComponentInteraction.matches(raw) && raw.data.component_type === ComponentType.Button
    );
  }

  toDJS() {
    // @ts-expect-error Discord.js marks this as a private constructor, which is stupid.
    return new ButtonInteraction(djs, this.raw);
  }
}
