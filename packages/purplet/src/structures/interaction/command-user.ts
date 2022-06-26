import {
  APIInteraction,
  APIUserApplicationCommandInteraction,
  ApplicationCommandType,
} from 'discord-api-types/v10';
import { CommandInteraction } from './command';
import { ContextCommandInteraction } from './command-context';

export class UserCommandInteraction<
  Data extends APIUserApplicationCommandInteraction = APIUserApplicationCommandInteraction
> extends ContextCommandInteraction<Data> {
  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIUserApplicationCommandInteraction {
    return CommandInteraction.matches(raw) && raw.data.type === ApplicationCommandType.User;
  }
  static is(obj: unknown): obj is UserCommandInteraction {
    return obj instanceof UserCommandInteraction;
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
