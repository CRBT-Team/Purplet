import {
  APIAttachment,
  APIInteractionDataResolvedChannel,
  APIRole,
  APIUser,
  ChannelType,
} from 'discord.js';
import { expectType } from 'tsd';
import { GetOptionsFromBuilder, OptionBuilder } from './OptionBuilder';

// alot of these type asserts do not even work. TODO: fix them i guess.

function extract<T extends OptionBuilder>(ob: T): GetOptionsFromBuilder<T> {
  return null as any;
}

// String Types
expectType<{ name: string }>(
  extract(
    new OptionBuilder().string('name', '', {
      required: true,
    })
  )
);
expectType<{ name?: string }>(
  extract(
    new OptionBuilder().string('name', '', {
      required: false,
    })
  )
);
expectType<{ name?: string }>(extract(new OptionBuilder().string('name', '', {})));
expectType<{ name?: string }>(extract(new OptionBuilder().string('name', '')));
expectType<{ name?: 'a' | 'b' }>(
  extract(
    new OptionBuilder().string('name', '', {
      choices: {
        a: 'a',
        b: 'b',
      },
    })
  )
);
expectType<{ name: 'a' | 'b' }>(
  extract(
    new OptionBuilder().string('name', '', {
      choices: {
        a: 'a',
        b: 'b',
      },
      required: true,
    })
  )
);
// Number Types
expectType<{ name: number }>(extract(new OptionBuilder().number('name', '', { required: true })));
expectType<{ name?: number | undefined }>(
  extract(new OptionBuilder().number('name', '', { required: false, maxValue: 0, minValue: 0 }))
);
expectType<{ name?: number | undefined }>(extract(new OptionBuilder().number('name', '')));
expectType<{ name?: number | undefined }>(extract(new OptionBuilder().number('name', '', {})));
// Integer types
expectType<{ name: number }>(extract(new OptionBuilder().integer('name', '', { required: true })));
expectType<{ name?: number | undefined }>(
  extract(new OptionBuilder().integer('name', '', { required: false, maxValue: 0, minValue: 0 }))
);
expectType<{ name?: number | undefined }>(extract(new OptionBuilder().integer('name', '')));
expectType<{ name?: number | undefined }>(extract(new OptionBuilder().integer('name', '', {})));
// Boolean types
expectType<{ name: boolean }>(extract(new OptionBuilder().boolean('name', '', { required: true })));
expectType<{ name?: boolean | undefined }>(
  extract(new OptionBuilder().boolean('name', '', { required: false }))
);
expectType<{ name?: boolean | undefined }>(extract(new OptionBuilder().boolean('name', '')));
expectType<{ name?: boolean | undefined }>(extract(new OptionBuilder().boolean('name', '', {})));
// Channel types
expectType<{ name: APIInteractionDataResolvedChannel }>(
  extract(
    new OptionBuilder().channel('name', '', {
      required: true,
      channelTypes: [ChannelType.GuildNews],
    })
  )
);
expectType<{ name?: APIInteractionDataResolvedChannel | undefined }>(
  extract(new OptionBuilder().channel('name', '', { required: false }))
);
// Role types
expectType<{ name: APIRole }>(extract(new OptionBuilder().role('name', '', { required: true })));
expectType<{ name?: APIRole | undefined }>(
  extract(new OptionBuilder().role('name', '', { required: false }))
);
// Mentionable types
expectType<{ name: APIRole | APIUser }>(
  extract(new OptionBuilder().mentionable('name', '', { required: true }))
);
expectType<{ name?: APIRole | APIUser | undefined }>(
  extract(new OptionBuilder().mentionable('name', '', { required: false }))
);
// User types
expectType<{ name: APIUser }>(extract(new OptionBuilder().user('name', '', { required: true })));
expectType<{ name?: APIUser | undefined }>(
  extract(new OptionBuilder().user('name', '', { required: false }))
);
// Attachment types
expectType<{ name: APIAttachment }>(
  extract(new OptionBuilder().attachment('name', '', { required: true }))
);
expectType<{ name?: APIAttachment | undefined }>(
  extract(new OptionBuilder().attachment('name', '', { required: false }))
);
