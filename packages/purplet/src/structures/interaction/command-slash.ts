import {
  APIApplicationCommandSubcommandGroupOption as SubcommandOption,
  APIChatInputApplicationCommandInteraction,
  APIInteraction,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'purplet/types';
import { CommandInteraction } from './command';
import { createInstanceofGuard } from '../../utils/class';

export class SlashCommandInteraction<
  Data extends APIChatInputApplicationCommandInteraction = APIChatInputApplicationCommandInteraction
> extends CommandInteraction<Data> {
  static is = createInstanceofGuard(SlashCommandInteraction);

  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIChatInputApplicationCommandInteraction {
    return CommandInteraction.matches(raw) && raw.data.type === ApplicationCommandType.ChatInput;
  }

  get options() {
    const firstType = this.raw.data.options?.[0]?.type;
    if (firstType === ApplicationCommandOptionType.Subcommand) {
      return this.raw.data.options![0].options ?? [];
    } else if (firstType === ApplicationCommandOptionType.SubcommandGroup) {
      return this.raw.data.options![0].options[0].options ?? [];
    } else {
      return this.raw.data.options ?? [];
    }
  }

  get subcommandName() {
    const type = this.raw.data.options?.[0]?.type;
    if (type === ApplicationCommandOptionType.Subcommand) {
      return this.raw.data.options![0].name;
    } else if (type === ApplicationCommandOptionType.SubcommandGroup) {
      return (this.raw.data.options![0] as SubcommandOption).options?.[0].name;
    } else {
      return null;
    }
  }

  get subcommandGroupName() {
    return (
      (this.raw.data.options &&
        this.raw.data.options[0]?.type === ApplicationCommandOptionType.SubcommandGroup &&
        this.raw.data.options[0].name) ??
      null
    );
  }

  get fullCommandName() {
    return [this.commandName, this.subcommandGroupName, this.subcommandName]
      .filter(Boolean)
      .join(' ');
  }

  getResolvedOption(name: string) {
    const opt = this.options.find(opt => opt.name === name);
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
        return this.getResolved('users', opt.value);

      default:
        return null;
    }
  }
}
