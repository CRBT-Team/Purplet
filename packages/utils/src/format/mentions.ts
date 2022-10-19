import {
  APIApplicationCommand,
  APIChannel,
  APIEmoji,
  APIRole,
  APIUser,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord-api-types/v10';

export const userMention = (user: APIUser) => `<@${user.id}>`;

export const channelMention = (channel: APIChannel) => `<#${channel.id}>`;

export const roleMention = (role: APIRole) => `<@&${role.id}>`;

export const slashCommandMention = (command: APIApplicationCommand) => {
  if (command.type !== ApplicationCommandType.ChatInput) {
    throw new Error(`Command type ${command.type} is not mentionable.`);
  }

  const commandName = [
    command.name,
    command.options?.find(o => o.type === ApplicationCommandOptionType.SubcommandGroup)?.name,
    command.options?.find(o => o.type === ApplicationCommandOptionType.Subcommand)?.name,
  ]
    .filter(Boolean)
    .join(' ');

  return `</${commandName}:${command.id}>`;
};

// i wanted to implement all the ones from Discord API Docs,
// and this one was too funny not to include
export const standardEmojiMention = (unicodeEmoji: string) => unicodeEmoji;

export const customEmojiMention = (emoji: APIEmoji) =>
  `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`;

export enum TimestampFormats {
  ShortTime = 't',
  LongTime = 'T',
  ShortDate = 'd',
  LongDate = 'D',
  ShortDateTime = 'f',
  LongDateTime = 'F',
  Relative = 'R',
}

export const timestampMention = (date: Date | number, format?: TimestampFormats) => {
  const timeMs = Math.round(date instanceof Date ? date.getTime() / 1000 : date);
  return `<t:${timeMs}:${format}>`;
};
