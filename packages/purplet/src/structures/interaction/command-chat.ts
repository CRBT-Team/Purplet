import {
  APIChatInputApplicationCommandInteraction,
  APIInteraction,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord-api-types/v10';
import { CommandInteraction } from './command';

export class ChatCommandInteraction<
  Data extends APIChatInputApplicationCommandInteraction = APIChatInputApplicationCommandInteraction
> extends CommandInteraction<Data> {
  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIChatInputApplicationCommandInteraction {
    return CommandInteraction.matches(raw) && raw.data.type === ApplicationCommandType.ChatInput;
  }

  get options() {
    return this.raw.data.options ?? [];
  }

  getResolvedOption(name: string) {
    const opt = this.raw.data.options?.find(option => option.name === name);
    if (!opt) {
      return null;
    }
    switch (opt.type) {
      case ApplicationCommandOptionType.String:
      case ApplicationCommandOptionType.Number:
      case ApplicationCommandOptionType.Integer:
      case ApplicationCommandOptionType.Boolean:
        return opt.value;
      case ApplicationCommandOptionType.Attachment:
        return this.getResolved('attachments', opt.value);
      case ApplicationCommandOptionType.Channel:
        return this.getResolved('channels', opt.value);
      case ApplicationCommandOptionType.Mentionable:
        return this.getResolved('roles', opt.value) ?? this.getResolved('users', opt.value);
      case ApplicationCommandOptionType.Role:
        return this.getResolved('roles', opt.value);
      case ApplicationCommandOptionType.User:
        return this.getResolved('attachments', opt.value);

      default:
        return null;
    }
  }
}
