import {
  APITextBasedChannel,
  RESTPostAPIChannelMessageResult,
  Routes,
  TextChannelType,
} from 'discord-api-types/v10';
import { Channel } from './base';
import { EmptyMessage, Message } from '../message';
import { CreateMessageData, resolveCreateMessageData } from '../resolve/create-message';
import { rest } from '../../lib/global';
import { createPartialClass, PartialClass } from '../../utils/class';

export class TextChannel<
  Data extends APITextBasedChannel<TextChannelType> = APITextBasedChannel<TextChannelType>
> extends Channel<Data> {
  async createMessage(message: CreateMessageData) {
    const { message: data, files } = resolveCreateMessageData(message);

    const response = (await rest.post(Routes.channelMessages(this.id), {
      body: data,
      files: files,
    })) as RESTPostAPIChannelMessageResult;

    return new Message(response);
  }

  get lastMessage() {
    return this.raw.last_message_id ? new EmptyMessage({ id: this.raw.last_message_id }) : null;
  }
}

export interface TextChannel<
  Data extends APITextBasedChannel<TextChannelType> = APITextBasedChannel<TextChannelType>
> {
  fetch(): Promise<TextChannel>;
}

export type EmptyTextChannel = PartialClass<
  // Class, Required properties from `raw`, Allowed methods from class
  typeof TextChannel,
  'id',
  'id' | 'fetch' | 'createMessage'
>;
export const EmptyTextChannel = createPartialClass<EmptyTextChannel>(TextChannel);
