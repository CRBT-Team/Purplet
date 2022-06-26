import {
  APIInteraction,
  APIUserApplicationCommandInteraction,
  ApplicationCommandType,
} from 'discord-api-types/v10';
import { CommandInteraction } from './command';
import { ContextCommandInteraction } from './command-context';
import { createInstanceofGuard } from '../../utils/class';

export class UserCommandInteraction<
  Data extends APIUserApplicationCommandInteraction = APIUserApplicationCommandInteraction
> extends ContextCommandInteraction<Data> {
  static is = createInstanceofGuard(UserCommandInteraction);

  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIUserApplicationCommandInteraction {
    return CommandInteraction.matches(raw) && raw.data.type === ApplicationCommandType.User;
  }

  get targetUser() {
    // Users are always given resolved for user commands.
    return this.getResolved('users', this.targetId)!;
  }

  get targetMember() {
    // Members are only given resolved if in a guild.
    return this.getResolved('members', this.targetId) ?? null;
  }

  get target() {
    return this.targetMember ?? this.targetUser;
  }
}
