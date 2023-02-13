import { deepStrictEqual } from 'assert';
import { describe, test } from 'bun:test';
import { AllowedMentionsTypes } from 'discord-api-types/v10';
import { resolveCreateMessageData } from './message';

describe('resolveCreateMessageData', () => {
  test('with a string', () => {
    deepStrictEqual(
      resolveCreateMessageData('hello world'),
      //
      {
        data: {
          content: 'hello world',
        },
        files: [],
      }
    );
  });

  test('object with basic data', () => {
    deepStrictEqual(
      resolveCreateMessageData({
        content: 'hello world',
        flags: 42,
        nonce: '123',
        tts: true,
        allowedMentions: {
          repliedUser: true,
          parse: [AllowedMentionsTypes.User, 'roles'],
          roles: ['123', '456'],
        },
      }),
      //
      {
        data: {
          content: 'hello world',
          allowed_mentions: {
            replied_user: true,
            parse: ['users'],
            roles: ['123', '456'],
          },
        },
        files: [],
      }
    );
  });

  test('stickers by id', () => {
    deepStrictEqual(
      resolveCreateMessageData({
        stickers: ['123', '456'],
      }),
      //
      {
        data: {
          sticker_ids: ['123', '456'],
        },
        files: [],
      }
    );
  });

  test('stickers by objects', () => {
    deepStrictEqual(
      resolveCreateMessageData({
        stickers: [{ id: '123' }, { id: '456' }],
      }),
      //
      {
        data: {
          sticker_ids: ['123', '456'],
        },
        files: [],
      }
    );
  });

  test('stickers by id and object with id', () => {
    deepStrictEqual(
      resolveCreateMessageData({
        stickers: ['123', { id: '456' }],
      }),
      //
      {
        data: {
          sticker_ids: ['123', '456'],
        },
        files: [],
      }
    );
  });

  test('sticker_ids passthrough', () => {
    deepStrictEqual(
      resolveCreateMessageData({
        sticker_ids: ['123', '456'],
      }),
      //
      {
        data: {
          sticker_ids: ['123', '456'],
        },
        files: [],
      }
    );
  });

  // todo: components
  // todo: embeds
  // todo: attachments
});
