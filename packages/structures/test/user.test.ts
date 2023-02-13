import { describe, expect, test } from 'bun:test';
import type { FakeRestRoutes } from './fake-rest';
import { initFakeRest } from './fake-rest';
import { User } from '../src';

const routes: FakeRestRoutes = {
  get: {
    '/users/@me': () => ({
      id: '123',
      username: 'test',
      discriminator: '1234',
      avatar: null,
      bot: false,
      system: false,
      mfa_enabled: false,
      locale: 'en-US',
      verified: false,
      email: null,
      flags: 0,
      premium_type: 0,
      public_flags: 0,
    }),
  },
};

describe('User', () => {
  test('current user is fetchable', async () => {
    initFakeRest(routes);

    const user = await User.fetchCurrentUser();
    expect(user.id).toBe('123');
    expect(user.username).toBe('test');
    expect(user.discriminator).toBe('1234');
    expect(user.avatarURL()).toBe('https://cdn.discordapp.com/embed/avatars/4.png');
    expect(user.isBot).toBe(false);
    expect(user.isMfaEnabled).toBe(false);
    expect(user.locale).toBe('en-US');
  });
});
