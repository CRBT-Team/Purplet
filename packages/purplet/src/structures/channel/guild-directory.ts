import type { APIGuildTextChannel, GuildTextChannelType } from 'purplet/types';
import { GuildTextChannel } from './guild-text';
import { createInstanceofGuard } from '../../utils/class';

/** UNDOCUMENTED? */
export class GuildDirectory<
  Data extends APIGuildTextChannel<GuildTextChannelType> = APIGuildTextChannel<GuildTextChannelType>
> extends GuildTextChannel<Data> {
  static is = createInstanceofGuard(GuildDirectory);
}
