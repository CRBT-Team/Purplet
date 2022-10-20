import type { APIApplicationCommand, APIEmoji, Snowflake } from 'discord-api-types/v10';
import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord-api-types/v10';

interface ObjectWithId {
  id: string;
}
type WithId = ObjectWithId | Snowflake;

function getId(base: WithId) {
  return (base as ObjectWithId)?.id ?? base;
}

export function userMention(user: WithId) {
  return `<@${getId(user)}>`;
}

export function channelMention(channel: WithId) {
  return `<#${getId(channel)}>`;
}

export function roleMention(role: WithId) {
  return `<@&${getId(role)}>`;
}

export function slashCommandMention(command: APIApplicationCommand) {
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
}

export function emojiMention(emoji: string | APIEmoji) {
  // if this is a unicode emoji
  if (typeof emoji === 'string') {
    return emoji;
  }

  return `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`;
}

export enum TimestampFormats {
  ShortTime = 't',
  LongTime = 'T',
  ShortDate = 'd',
  LongDate = 'D',
  ShortDateTime = 'f',
  LongDateTime = 'F',
  Relative = 'R',
}

export function timestampMention(date: Date | number, format?: TimestampFormats) {
  const timeMs = Math.round(date instanceof Date ? date.getTime() / 1000 : date);
  return `<t:${timeMs}:${format}>`;
}
