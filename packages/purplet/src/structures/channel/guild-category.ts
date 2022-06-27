import type { APIGuildCategoryChannel } from 'discord-api-types/v10';
import { GuildChannelBase } from './base-guild';
import { createInstanceofGuard, createPartialClass, PartialClass } from '../../utils/class';

export class CategoryChannel<
  Data extends APIGuildCategoryChannel = APIGuildCategoryChannel
> extends GuildChannelBase<Data> {
  static is = createInstanceofGuard(CategoryChannel);
}

export interface CategoryChannel<Data extends APIGuildCategoryChannel = APIGuildCategoryChannel> {
  fetch(): Promise<CategoryChannel>;
}

export interface EmptyCategoryChannel
  extends PartialClass<
    // Class, Required properties from `raw`, Allowed methods from class
    typeof CategoryChannel,
    'id',
    'id' | 'fetch' | 'delete'
  > {}
export const EmptyCategoryChannel = createPartialClass<EmptyCategoryChannel>(CategoryChannel);
