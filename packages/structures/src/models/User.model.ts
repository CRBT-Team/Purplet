import { createModel, Model } from '@purplet/model';
import { APIUser } from 'discord-api-types/payloads';
import { UserFlagsBitfield } from '../bitfield';

export type User = InstanceType<typeof User>;
export const User = createModel((m: Model<APIUser>) =>
  m
    .copy('id')
    .method('toString', ['id'], self => `<@${self.id}>`)
    .method('fetch', ['id'], async self => {
      // TODO: think about how the rest client should be setup.
      throw new Error('Not implemented');
    })

    .copy('username')
    .copy('discriminator')
    .copy('avatar', 'avatarHash')
    .copy('banner', 'bannerHash')
    .copy('accent_color', 'accentColor')

    // TODO: the dependency `discriminator` should be optional.
    .get(
      'tag',
      ['username', 'discriminator'],
      self => `${self.username}#${self.discriminator ?? '0000'}`
    )

    .get('isBot', ['bot', 'system'], self => !!(self.raw.bot ?? self.raw.system))

    // TODO: the dependency should be `flags` OR `public_flags`, not AND
    .get(
      'flags',
      ['flags', 'public_flags'],
      self => new UserFlagsBitfield(self.raw.flags ?? self.raw.public_flags)
    )

    .get('hypesquadHouse', ['flags', 'public_flags'], ({ flags }) =>
      flags.hasHypeSquadOnlineHouse1
        ? 'bravery'
        : flags.hasHypeSquadOnlineHouse2
        ? 'brilliance'
        : flags.hasHypeSquadOnlineHouse3
        ? 'balance'
        : null
    )

    .method(
      'avatarURL',
      ['id', 'avatar'],
      // TODO: Accept an ImageURLOptions object
      (self, opts: any) => `https://cdn.discordapp.com/avatars/${self.id}/${self.avatarHash}`
    )

    .method(
      'bannerURL',
      ['id', 'banner'],
      // TODO: Accept an ImageURLOptions object
      (self, opts: any) => `https://cdn.discordapp.com/banners/${self.id}/${self.bannerHash}`
    )
);

export type PartialUser = InstanceType<typeof PartialUser>;
export const PartialUser = User.pick([
  'id',
  'avatar',
  'discriminator',
  'flags',
  'public_flags',
  'username',
  'bot',
  'system',
]);

export type EmptyUser = InstanceType<typeof EmptyUser>;
export const EmptyUser = User.pick(['id']);
