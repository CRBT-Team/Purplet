import { ChannelType } from 'purplet/types';
import { channelClasses } from './create';
import { DMChannel } from './dm';
import { GroupDMChannel } from './dm-group';
import { CategoryChannel } from './guild-category';
import { GuildDirectory } from './guild-directory';
import { ForumChannel } from './guild-forum';
import { NewsChannel } from './guild-news';
import { StageChannel } from './guild-stage';
import { GuildTextChannel } from './guild-text';
import { VoiceChannel } from './guild-voice';

export * from './base';
export * from './base-guild';
export * from './base-text';
export * from './base-voice';
export { createChannel } from './create';
export * from './dm';
export * from './dm-group';
export * from './guild-category';
export * from './guild-directory';
export * from './guild-forum';
export * from './guild-news';
export * from './guild-stage';
export * from './guild-text';
export * from './guild-voice';

channelClasses.set(ChannelType.GuildText, GuildTextChannel);
channelClasses.set(ChannelType.DM, DMChannel);
channelClasses.set(ChannelType.GuildVoice, VoiceChannel);
channelClasses.set(ChannelType.GroupDM, GroupDMChannel);
channelClasses.set(ChannelType.GuildCategory, CategoryChannel);
channelClasses.set(ChannelType.GuildNews, NewsChannel);
// channelClasses.set(ChannelType.GuildNewsThread, null)
// channelClasses.set(ChannelType.GuildPublicThread, null)
// channelClasses.set(ChannelType.GuildPrivateThread, null)
channelClasses.set(ChannelType.GuildStageVoice, StageChannel);
channelClasses.set(ChannelType.GuildDirectory, GuildDirectory);
channelClasses.set(ChannelType.GuildForum, ForumChannel);
