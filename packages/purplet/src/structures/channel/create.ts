import type { Class } from '@davecode/types';
import type { APIChannel, ChannelType } from 'purplet/types';
import type { Channel } from '../..';

export const channelClasses = new Map<ChannelType, Class<Channel>>();

export function createChannel(raw: APIChannel): Channel {
  const Subclass = channelClasses.get(raw.type);
  if (!Subclass) {
    throw new Error(`No matching Channel for passed APIChannel: ${JSON.stringify(raw)}`);
  }
  return new Subclass(raw);
}
