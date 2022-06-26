import {
  APITextBasedChannel,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageResult,
  Routes,
  TextChannelType,
} from 'discord-api-types/v10';
import { Channel } from './base';
import { EmptyMessage, Message } from '../message';
import { rest } from '../../lib/global';
import type { JSONResolvable } from '../../utils/plain';

export class TextChannelBase<
  Data extends APITextBasedChannel<TextChannelType> = APITextBasedChannel<TextChannelType>
> extends Channel<Data> {
  // TODO: support file uploads and etc
  async createMessage(message: JSONResolvable<RESTPostAPIChannelMessageJSONBody>) {
    const response = (await rest.post(Routes.channelMessages(this.id), {
      body: message,
      files: [],
    })) as RESTPostAPIChannelMessageResult;

    return new Message(response);
  }

  get lastMessage() {
    return this.raw.last_message_id ? new EmptyMessage({ id: this.raw.last_message_id }) : null;
  }
}
