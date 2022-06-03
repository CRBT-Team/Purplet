import {
  ActivityFlags,
  ApplicationFlags,
  ChannelFlags,
  GatewayIntentBits,
  GuildSystemChannelFlags,
  MessageFlags,
  PermissionFlagsBits,
  ThreadMemberFlags,
  UserFlags,
} from 'discord-api-types/v10';
import { createBitfieldClass, createReadonlyBitfield } from './bit-field-base';

// For this file, use the workspace snippet "template_bitfield"

export const UserFlagsBitfield = createBitfieldClass<typeof UserFlags>(
  'UserFlagsBitfield',
  UserFlags
);
export const ReadonlyUserFlagsBitfield = createReadonlyBitfield(UserFlagsBitfield);
export type UserFlagsBitField = InstanceType<typeof UserFlagsBitfield>;
export type ReadonlyUserFlagsBitField = InstanceType<typeof ReadonlyUserFlagsBitfield>;

export const MessageFlagsBitfield = createBitfieldClass<typeof MessageFlags>(
  'MessageFlagsBitfield',
  MessageFlags
);
export const ReadonlyMessageFlagsBitfield = createReadonlyBitfield(MessageFlagsBitfield);
export type MessageFlagsBitField = InstanceType<typeof MessageFlagsBitfield>;
export type ReadonlyMessageFlagsBitField = InstanceType<typeof ReadonlyMessageFlagsBitfield>;

export const ChannelFlagsBitfield = createBitfieldClass<typeof ChannelFlags>(
  'ChannelFlagsBitfield',
  ChannelFlags
);
export const ReadonlyChannelFlagsBitfield = createReadonlyBitfield(ChannelFlagsBitfield);
export type ChannelFlagsBitField = InstanceType<typeof ChannelFlagsBitfield>;
export type ReadonlyChannelFlagsBitField = InstanceType<typeof ReadonlyChannelFlagsBitfield>;

export const ActivityFlagsBitfield = createBitfieldClass<typeof ActivityFlags>(
  'ActivityFlagsBitfield',
  ActivityFlags
);
export const ReadonlyActivityFlagsBitfield = createReadonlyBitfield(ActivityFlagsBitfield);
export type ActivityFlagsBitField = InstanceType<typeof ActivityFlagsBitfield>;
export type ReadonlyActivityFlagsBitField = InstanceType<typeof ReadonlyActivityFlagsBitfield>;

export const PermissionBitfield = createBitfieldClass<typeof PermissionFlagsBits>(
  'PermissionBitfield',
  PermissionFlagsBits
);
export const ReadonlyPermissionBitfield = createReadonlyBitfield(PermissionBitfield);
export type PermissionBitField = InstanceType<typeof PermissionBitfield>;
export type ReadonlyPermissionBitField = InstanceType<typeof ReadonlyPermissionBitfield>;

export const IntentBitfield = createBitfieldClass<typeof GatewayIntentBits>(
  'IntentBitfield',
  GatewayIntentBits
);
export const ReadonlyIntentBitfield = createReadonlyBitfield(IntentBitfield);
export type IntentBitField = InstanceType<typeof IntentBitfield>;
export type ReadonlyIntentBitField = InstanceType<typeof ReadonlyIntentBitfield>;

export const ApplicationFlagsBitfield = createBitfieldClass<typeof ApplicationFlags>(
  'ApplicationFlagsBitfield',
  ApplicationFlags
);
export const ReadonlyApplicationFlagsBitfield = createReadonlyBitfield(ApplicationFlagsBitfield);
export type ApplicationFlagsBitField = InstanceType<typeof ApplicationFlagsBitfield>;
export type ReadonlyApplicationFlagsBitField = InstanceType<
  typeof ReadonlyApplicationFlagsBitfield
>;

export const ThreadMemberFlagsBitfield = createBitfieldClass<typeof ThreadMemberFlags>(
  'ThreadMemberFlagsBitfield',
  ThreadMemberFlags
);
export const ReadonlyThreadMemberFlagsBitfield = createReadonlyBitfield(ThreadMemberFlagsBitfield);
export type ThreadMemberFlagsBitField = InstanceType<typeof ThreadMemberFlagsBitfield>;
export type ReadonlyThreadMemberFlagsBitField = InstanceType<
  typeof ReadonlyThreadMemberFlagsBitfield
>;

export const GuildSystemChannelFlagsBitfield = createBitfieldClass<typeof GuildSystemChannelFlags>(
  'GuildSystemChannelFlagsBitfield',
  GuildSystemChannelFlags
);
export const ReadonlyGuildSystemChannelFlagsBitfield = createReadonlyBitfield(
  GuildSystemChannelFlagsBitfield
);
export type GuildSystemChannelFlagsBitField = InstanceType<typeof GuildSystemChannelFlagsBitfield>;
export type ReadonlyGuildSystemChannelFlagsBitField = InstanceType<
  typeof ReadonlyGuildSystemChannelFlagsBitfield
>;
