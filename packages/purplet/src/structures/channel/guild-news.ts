import type { APINewsChannel } from 'discord-api-types/v10';
import { GuildTextChannel } from './guild-text';
import { createInstanceofGuard } from '../../utils/class';

export class NewsChannel<
  Data extends APINewsChannel = APINewsChannel
> extends GuildTextChannel<Data> {
  static is = createInstanceofGuard(NewsChannel);
}
