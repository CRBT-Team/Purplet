import {
  APIChatInputApplicationCommandInteraction,
  APIInteraction,
  ApplicationCommandType,
  ChatInputCommandInteraction,
} from 'discord.js';
import { PurpletCommandInteraction } from './command';
import { djs } from '../global';

export class PurpletChatCommandInteraction<
  Data extends APIChatInputApplicationCommandInteraction = APIChatInputApplicationCommandInteraction
> extends PurpletCommandInteraction<Data> {
  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIChatInputApplicationCommandInteraction {
    return (
      PurpletCommandInteraction.matches(raw) && raw.data.type === ApplicationCommandType.ChatInput
    );
  }

  toDJS() {
    // @ts-expect-error Discord.js marks this as a private constructor, which is stupid.
    return new ChatInputCommandInteraction(djs, this.raw);
  }
}
