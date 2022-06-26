import type { APIGuildCategoryChannel } from 'discord-api-types/v10';
import { GuildChannelBase } from './base-guild';
import { createInstanceofGuard } from '../../utils/class';

export class CategoryChannel<
  Data extends APIGuildCategoryChannel = APIGuildCategoryChannel
> extends GuildChannelBase<Data> {
  static is = createInstanceofGuard(CategoryChannel);
}
