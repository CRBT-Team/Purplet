import type { APIGuildChannel, ChannelType } from 'purplet/types';
import { Channel } from './base';
import { EmptyCategoryChannel } from './guild-category';
import { EmptyGuild } from '../guild';

export class GuildChannelBase<
  Data extends APIGuildChannel<ChannelType> = APIGuildChannel<ChannelType>
> extends Channel<Data> {
  get guild() {
    // TODO: make sure this never returns null. type wise, and also implementation wise. Any partial version of a guild channel should include the guild
    return this.raw.guild_id ? new EmptyGuild({ id: this.raw.guild_id }) : null;
  }

  get permissionOverwrites() {
    return this.raw.permission_overwrites ?? [];
  }

  get position() {
    return this.raw.position!;
  }

  get parent(): EmptyCategoryChannel | null {
    return this.raw.parent_id ? new EmptyCategoryChannel({ id: this.raw.parent_id }) : null;
  }

  get isNSFW() {
    return this.raw.nsfw ?? false;
  }

  compareTo(other: GuildChannelBase) {
    return this.position - other.position;
  }
}

export interface GuildChannelBase<
  Data extends APIGuildChannel<ChannelType> = APIGuildChannel<ChannelType>
> {
  fetch(): Promise<GuildChannelBase>;
}
