import type { APIGuildTextChannel, GuildTextChannelType } from 'discord-api-types/v10';
import { GuildTextChannel } from './guild-text';
import { createInstanceofGuard } from '../../utils/class';

/** UNDOCUMENTED? */
export class GuildDirectory<
  Data extends APIGuildTextChannel<GuildTextChannelType> = APIGuildTextChannel<GuildTextChannelType>
> extends GuildTextChannel<Data> {
  static is = createInstanceofGuard(GuildDirectory);
}
