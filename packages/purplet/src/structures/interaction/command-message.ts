import type {
  APIInteraction,
  APIMessageApplicationCommandInteraction} from 'purplet/types';
import {
  ApplicationCommandType,
} from 'purplet/types';
import { CommandInteraction } from './command';
import { ContextCommandInteraction } from './command-context';
import { createInstanceofGuard } from '../../utils/class';

export class MessageCommandInteraction<
  Data extends APIMessageApplicationCommandInteraction = APIMessageApplicationCommandInteraction
> extends ContextCommandInteraction<Data> {
  static is = createInstanceofGuard(MessageCommandInteraction);

  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIMessageApplicationCommandInteraction {
    return CommandInteraction.matches(raw) && raw.data.type === ApplicationCommandType.Message;
  }

  get target() {
    return this.getResolved('messages', this.targetId)!;
  }
}
