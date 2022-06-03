import type { Immutable } from '@davecode/types';
import {
  APIChannel,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageResult,
  Routes,
} from 'discord-api-types/v10';
import { Message } from './message';
import { rest } from '../lib/global';
import { createPartialClass, PartialClass } from '../utils/partial';
import type { JSONResolvable } from '../utils/plain';

/** Structure for APIChannel. */
// TODO: you gotta make a LOT of channel subclasses lol.
export class Channel {
  constructor(readonly raw: Immutable<APIChannel>) {}

  async fetch() {
    return new Channel((await rest.get(Routes.channel(this.id))) as APIChannel);
  }

  get id() {
    return this.raw.id;
  }
}

export class TextChannel extends Channel {
  // TODO: support file uploads and etc
  async createMessage(message: JSONResolvable<RESTPostAPIChannelMessageJSONBody>) {
    const response = (await rest.post(Routes.channelMessages(this.id), {
      body: message,
      files: [],
    })) as RESTPostAPIChannelMessageResult;

    return new Message(response);
  }
}

export type EmptyChannel = PartialClass<
  // Class, Required properties from `raw`, Allowed methods from class
  typeof Channel,
  'id',
  'id' | 'fetch'
>;
export const EmptyChannel = createPartialClass<EmptyChannel>(Channel);

export type EmptyTextChannel = PartialClass<
  // Class, Required properties from `raw`, Allowed methods from class
  typeof TextChannel,
  'id',
  'id' | 'fetch' | 'createMessage'
>;
export const EmptyTextChannel = createPartialClass<EmptyTextChannel>(Channel);
