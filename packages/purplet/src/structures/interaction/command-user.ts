import {
  APIInteraction,
  APIUserApplicationCommandInteraction,
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { PurpletCommandInteraction } from './command';
import { PurpletContextCommandInteraction } from './command-context';
import { djs } from '../../lib/global';

export class PurpletUserCommandInteraction<
  Data extends APIUserApplicationCommandInteraction = APIUserApplicationCommandInteraction
> extends PurpletContextCommandInteraction<Data> {
  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIUserApplicationCommandInteraction {
    return PurpletCommandInteraction.matches(raw) && raw.data.type === ApplicationCommandType.User;
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

  toDJS(): UserContextMenuCommandInteraction {
    // @ts-expect-error Discord.js marks this as a private constructor, which is stupid.
    return new UserContextMenuCommandInteraction(djs, this.raw);
  }
}
