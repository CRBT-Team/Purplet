import { describe, expect, test } from 'bun:test';
import { resolveUserAvatarURL } from './avatar';
import { CDN_BASE_URL } from '../routes';

describe('resolveUserAvatarURL', () => {
  test('no data', () => {
    expect(resolveUserAvatarURL({})).toBe(`${CDN_BASE_URL}/embed/avatars/0.png`);
  });
  test('discriminator', () => {
    expect(
      resolveUserAvatarURL({
        discriminator: '0044',
      })
    ).toBe(`${CDN_BASE_URL}/embed/avatars/4.png`);
  });
  test('id + discriminator + hash', () => {
    expect(
      resolveUserAvatarURL({
        id: '[id]',
        discriminator: '0044',
        avatar: '[hash]',
      })
    ).toBe(`${CDN_BASE_URL}/avatars/[id]/[hash].webp`);
  });
  test('hash + discriminator', () => {
    expect(
      resolveUserAvatarURL({
        discriminator: '0044',
        avatar: '[hash]',
      })
      // id is needed in url, so not given
    ).toBe(`${CDN_BASE_URL}/embed/avatars/4.png`);
  });
});
