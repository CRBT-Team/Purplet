import type { APIApplicationCommand, APIPartialEmoji, Snowflake } from 'discord-api-types/v10';
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

export type SlashCommandMentionData = Partial<Pick<APIApplicationCommand, 'type' | 'options'>> &
  Pick<APIApplicationCommand, 'id' | 'name'>;

export function slashCommandMention(command: SlashCommandMentionData) {
  if (command.type && command.type !== ApplicationCommandType.ChatInput) {
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

export function emojiMention(emoji: APIPartialEmoji) {
  return `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`;
}

export enum TimestampFormat {
  ShortTime = 't',
  LongTime = 'T',
  ShortDate = 'd',
  LongDate = 'D',
  ShortDateTime = 'f',
  LongDateTime = 'F',
  Relative = 'R',
}

export function timestampMention(
  // This type accepts numbers, Dates, dayjs objects, and anything else that has valueOf(): number
  date: number | { valueOf(): number },
  format: `${TimestampFormat}` | TimestampFormat = TimestampFormat.ShortDateTime
) {
  return `<t:${Math.floor(date.valueOf() / 1000)}${
    format === TimestampFormat.ShortDateTime ? '' : `:${format}`
  }>`;
}
