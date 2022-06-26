import type { APIGuildTextChannel, GuildTextChannelType } from 'discord-api-types/v10';
import { Channel } from './base';
import { GuildChannelBase } from './base-guild';
import { createInstanceofGuard } from '../../utils/class';
import { applyMixin } from '../../utils/mixin';

export class GuildTextChannel<
  Data extends APIGuildTextChannel<GuildTextChannelType> = APIGuildTextChannel<GuildTextChannelType>
> extends Channel<Data> {
  static is = createInstanceofGuard(GuildTextChannel);

  get defaultAutoArchiveDuration() {
    return this.raw.default_auto_archive_duration!;
  }

  get topic() {
    return this.raw.topic ?? null;
  }

  get lastPinTime() {
    return this.raw.last_pin_timestamp ? new Date(this.raw.last_pin_timestamp) : null;
  }
}

export interface GuildTextChannel<
  Data extends APIGuildTextChannel<GuildTextChannelType> = APIGuildTextChannel<GuildTextChannelType>
> extends GuildChannelBase<Data> {}

applyMixin(GuildTextChannel, GuildChannelBase);
