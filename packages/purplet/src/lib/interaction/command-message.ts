import {
  APIInteraction,
  APIMessageApplicationCommandInteraction,
  ApplicationCommandType,
  MessageContextMenuCommandInteraction,
} from 'discord.js';
import { PurpletCommandInteraction } from './command';
import { PurpletContextCommandInteraction } from './command-context';
import { djs } from '../global';

export class PurpletMessageCommandInteraction<
  Data extends APIMessageApplicationCommandInteraction = APIMessageApplicationCommandInteraction
> extends PurpletContextCommandInteraction<Data> {
  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIMessageApplicationCommandInteraction {
    return (
      PurpletCommandInteraction.matches(raw) && raw.data.type === ApplicationCommandType.Message
    );
  }

  get target() {
    return this.getResolved('messages', this.targetId)!;
  }

  toDJS() {
    // @ts-expect-error Discord.js marks this as a private constructor, which is stupid.
    return new MessageContextMenuCommandInteraction(djs, this.raw);
  }
}
