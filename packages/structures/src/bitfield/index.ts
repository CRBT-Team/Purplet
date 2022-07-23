import { GatewayIntentBits } from 'discord-api-types/gateway';
import {
  ActivityFlags,
  ApplicationFlags,
  ChannelFlags,
  GuildSystemChannelFlags,
  MessageFlags,
  PermissionFlagsBits,
  ThreadMemberFlags,
  UserFlags,
} from 'discord-api-types/payloads';
import { createBitfieldClass, createReadonlyBitfield } from './base';

// For this file, use the workspace snippet "template_bitfield"

export const UserFlagsBitfield = createBitfieldClass<typeof UserFlags>(
  'UserFlagsBitfield',
  UserFlags
);
export const ReadonlyUserFlagsBitfield = createReadonlyBitfield(UserFlagsBitfield);
export type UserFlagsBitfield = InstanceType<typeof UserFlagsBitfield>;
export type ReadonlyUserFlagsBitfield = InstanceType<typeof ReadonlyUserFlagsBitfield>;

export const MessageFlagsBitfield = createBitfieldClass<typeof MessageFlags>(
  'MessageFlagsBitfield',
  MessageFlags
);
export const ReadonlyMessageFlagsBitfield = createReadonlyBitfield(MessageFlagsBitfield);
export type MessageFlagsBitfield = InstanceType<typeof MessageFlagsBitfield>;
export type ReadonlyMessageFlagsBitfield = InstanceType<typeof ReadonlyMessageFlagsBitfield>;

export const ChannelFlagsBitfield = createBitfieldClass<typeof ChannelFlags>(
  'ChannelFlagsBitfield',
  ChannelFlags
);
export const ReadonlyChannelFlagsBitfield = createReadonlyBitfield(ChannelFlagsBitfield);
export type ChannelFlagsBitfield = InstanceType<typeof ChannelFlagsBitfield>;
export type ReadonlyChannelFlagsBitfield = InstanceType<typeof ReadonlyChannelFlagsBitfield>;

export const ActivityFlagsBitfield = createBitfieldClass<typeof ActivityFlags>(
  'ActivityFlagsBitfield',
  ActivityFlags
);
export const ReadonlyActivityFlagsBitfield = createReadonlyBitfield(ActivityFlagsBitfield);
export type ActivityFlagsBitfield = InstanceType<typeof ActivityFlagsBitfield>;
export type ReadonlyActivityFlagsBitfield = InstanceType<typeof ReadonlyActivityFlagsBitfield>;

export const PermissionsBitfield = createBitfieldClass<typeof PermissionFlagsBits>(
  'PermissionBitfield',
  PermissionFlagsBits
);
export const ReadonlyPermissionsBitfield = createReadonlyBitfield(PermissionsBitfield);
export type PermissionsBitfield = InstanceType<typeof PermissionsBitfield>;
export type ReadonlyPermissionsBitfield = InstanceType<typeof ReadonlyPermissionsBitfield>;

export const IntentsBitfield = createBitfieldClass<typeof GatewayIntentBits>(
  'IntentBitfield',
  GatewayIntentBits
);
export const ReadonlyIntentsBitfield = createReadonlyBitfield(IntentsBitfield);
export type IntentsBitfield = InstanceType<typeof IntentsBitfield>;
export type ReadonlyIntentsBitfield = InstanceType<typeof ReadonlyIntentsBitfield>;

export const ApplicationFlagsBitfield = createBitfieldClass<typeof ApplicationFlags>(
  'ApplicationFlagsBitfield',
  ApplicationFlags
);
export const ReadonlyApplicationFlagsBitfield = createReadonlyBitfield(ApplicationFlagsBitfield);
export type ApplicationFlagsBitfield = InstanceType<typeof ApplicationFlagsBitfield>;
export type ReadonlyApplicationFlagsBitfield = InstanceType<
  typeof ReadonlyApplicationFlagsBitfield
>;

export const ThreadMemberFlagsBitfield = createBitfieldClass<typeof ThreadMemberFlags>(
  'ThreadMemberFlagsBitfield',
  ThreadMemberFlags
);
export const ReadonlyThreadMemberFlagsBitfield = createReadonlyBitfield(ThreadMemberFlagsBitfield);
export type ThreadMemberFlagsBitfield = InstanceType<typeof ThreadMemberFlagsBitfield>;
export type ReadonlyThreadMemberFlagsBitfield = InstanceType<
  typeof ReadonlyThreadMemberFlagsBitfield
>;

export const GuildSystemChannelFlagsBitfield = createBitfieldClass<typeof GuildSystemChannelFlags>(
  'GuildSystemChannelFlagsBitfield',
  GuildSystemChannelFlags
);
export const ReadonlyGuildSystemChannelFlagsBitfield = createReadonlyBitfield(
  GuildSystemChannelFlagsBitfield
);
export type GuildSystemChannelFlagsBitfield = InstanceType<typeof GuildSystemChannelFlagsBitfield>;
export type ReadonlyGuildSystemChannelFlagsBitfield = InstanceType<
  typeof ReadonlyGuildSystemChannelFlagsBitfield
>;
