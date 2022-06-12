import {
  APIInteraction,
  APIMessageApplicationCommandInteraction,
  ApplicationCommandType,
} from 'discord-api-types/v10';
import { CommandInteraction } from './command';
import { ContextCommandInteraction } from './command-context';

export class MessageCommandInteraction<
  Data extends APIMessageApplicationCommandInteraction = APIMessageApplicationCommandInteraction
> extends ContextCommandInteraction<Data> {
  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIMessageApplicationCommandInteraction {
    return CommandInteraction.matches(raw) && raw.data.type === ApplicationCommandType.Message;
  }

  get target() {
    return this.getResolved('messages', this.targetId)!;
  }
}
