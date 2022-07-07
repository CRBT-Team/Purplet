import type { Immutable } from '@davecode/types';
import type { APIMessage } from 'purplet/types';
import { ReadonlyMessageFlagsBitfield } from './bit-field';
import { PartialUser } from './user';
import { createPartialClass, PartialClass } from '../utils/class';

/** This class has a long way to go but its OK right now. */
export class Message {
  // TODO Fields: mentions, mention_roles, mention_everyone, mention_channels, and everything that is hidden lol.
  constructor(readonly raw: Immutable<APIMessage>) {}

  get id() {
    return this.raw.id;
  }

  get type() {
    return this.raw.type;
  }

  get createdAt() {
    return new Date(this.raw.timestamp);
  }

  get editedAt() {
    return this.raw.edited_timestamp ? new Date(this.raw.edited_timestamp) : null;
  }

  get content() {
    return this.raw.content;
  }

  get author() {
    return new PartialUser(this.raw.author);
  }

  get channelId() {
    return this.raw.channel_id;
  }

  // get guildId() {
  //   return this.raw.guild_id;
  // }

  // get member() {
  //   return this.raw.member;
  // }

  get attachments() {
    return this.raw.attachments;
  }

  get activity() {
    return this.raw.activity;
  }

  get components() {
    return this.raw.components;
  }

  get embeds() {
    return this.raw.embeds;
  }

  get stickers() {
    return this.raw.sticker_items;
  }

  get reactions() {
    return this.raw.reactions;
  }

  get isPinned() {
    return this.raw.pinned;
  }

  get isTTS() {
    return this.raw.tts;
  }

  get flags() {
    return new ReadonlyMessageFlagsBitfield(this.raw.flags);
  }
}

export type EmptyMessage = PartialClass<
  //
  typeof Message,
  'id',
  'id'
>;
export const EmptyMessage = createPartialClass<EmptyMessage>(Message);
