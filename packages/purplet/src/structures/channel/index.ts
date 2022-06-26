import { APIChannel, ChannelType } from 'discord-api-types/v10';
import { CategoryChannel, NewsChannel } from 'discord.js';
import type { Channel } from './base';
import { DMChannel } from './dm';
import { GroupDMChannel } from './dm-group';
import { GuildDirectory } from './guild-directory';
import { ForumChannel } from './guild-forum';
import { StageChannel } from './guild-stage';
import { GuildTextChannel } from './guild-text';
import { VoiceChannel } from './guild-voice';

export * from './base';
export * from './base-guild';
export * from './base-text';
export * from './base-voice';
export * from './dm';
export * from './dm-group';
export * from './guild-category';
export * from './guild-directory';
export * from './guild-forum';
export * from './guild-news';
export * from './guild-stage';
export * from './guild-text';
export * from './guild-voice';

const types = new Map<ChannelType, any>([
  [ChannelType.GuildText, GuildTextChannel],
  [ChannelType.DM, DMChannel],
  [ChannelType.GuildVoice, VoiceChannel],
  [ChannelType.GroupDM, GroupDMChannel],
  [ChannelType.GuildCategory, CategoryChannel],
  [ChannelType.GuildNews, NewsChannel],
  [ChannelType.GuildNewsThread, null],
  [ChannelType.GuildPublicThread, null],
  [ChannelType.GuildPrivateThread, null],
  [ChannelType.GuildStageVoice, StageChannel],
  [ChannelType.GuildDirectory, GuildDirectory],
  [ChannelType.GuildForum, ForumChannel],
]);

export function createChannel(raw: APIChannel): Channel {
  const Subclass = types.get(raw.type);
  if (!Subclass) {
    throw new Error(`No matching Channel for passed APIChannel: ${JSON.stringify(raw)}`);
  }
  return new Subclass(raw);
}
