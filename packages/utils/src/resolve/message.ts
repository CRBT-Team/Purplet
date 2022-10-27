import type { RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v10';
import type { ShallowCamelCaseObj } from '../camel-case';
import type { DataWithFiles } from '../file';
import type { JSONResolvable } from '../json';
import { toJSONValue } from '../json';

export type CreateMessageData = JSONResolvable<string | CreateMessageObject>;

export type CreateMessageObject = ShallowCamelCaseObj<
  Pick<
    RESTPostAPIChannelMessageJSONBody,
    'content' | 'allowed_mentions' | 'flags' | 'nonce' | 'tts'
  >
>;

export type ResolvedCreateMessageData = DataWithFiles<RESTPostAPIChannelMessageJSONBody>;

export function resolveCreateMessageData(input: CreateMessageData): ResolvedCreateMessageData {
  const data = toJSONValue(input);
  if (typeof data === 'string') {
    return {
      data: {
        content: data,
      },
      files: [],
    };
  }

  throw new Error('not implemented');
}
