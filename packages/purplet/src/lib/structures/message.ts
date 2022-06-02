import type { APIMessage } from 'discord.js';

export class PurpletMessage {
  constructor(readonly raw: APIMessage) {}

  get id() {
    return this.raw.id;
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

  get flags() {
    return this.raw.flags;
  }
}
