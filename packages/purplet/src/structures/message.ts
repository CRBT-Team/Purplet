import type { Immutable } from '@davecode/types';
import { APIMessage, MessageFlags } from 'discord.js';
import { createPartialClass, PartialClass } from '../utils/partial';

/** This class has a long way to go but its OK right now. */
export class PurpletMessage {
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
    return this.raw.author;
  }

  get channelId() {
    return this.raw.channel_id;
  }

  get guildId() {
    return this.raw.guild_id;
  }

  get member() {
    return this.raw.member;
  }

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

  /** This message has been published to subscribed channels (via Channel Following) */
  get isCrossposted() {
    return (this.raw.flags ?? 0) & MessageFlags.Crossposted;
  }
  /** This message originated from a message in another channel (via Channel Following) */
  get isCrosspost() {
    return (this.raw.flags ?? 0) & MessageFlags.IsCrosspost;
  }
  /** Do not include any embeds when serializing this message. */
  get suppressEmbeds() {
    return (this.raw.flags ?? 0) & MessageFlags.SuppressEmbeds;
  }
  /** The source message for this crosspost has been deleted (via Channel Following) */
  get isSourceDeleted() {
    return (this.raw.flags ?? 0) & MessageFlags.SourceMessageDeleted;
  }
  /** This message came from the urgent message system. */
  get isUrgent() {
    return (this.raw.flags ?? 0) & MessageFlags.Urgent;
  }
  /** This message has an associated thread, which shares its id. */
  get hasThread() {
    return (this.raw.flags ?? 0) & MessageFlags.HasThread;
  }
  /** This message is only visible to the user who invoked the Interaction. */
  get isEphemeral() {
    return (this.raw.flags ?? 0) & MessageFlags.Ephemeral;
  }
  /** This message is an Interaction Response and the bot is "thinking" */
  get isLoading() {
    return (this.raw.flags ?? 0) & MessageFlags.Loading;
  }
  /** This message failed to mention some roles and add their members to the thread. */
  get isFailedToMentionSomeRolesInThread() {
    return (this.raw.flags ?? 0) & MessageFlags.FailedToMentionSomeRolesInThread;
  }
}

export type PurpletMessagePartial = PartialClass<
  //
  typeof PurpletMessage,
  'id',
  'id'
>;
export const PurpletMessagePartial = createPartialClass<PurpletMessagePartial>(PurpletMessage);
