import type { APIGuildCategoryChannel } from 'purplet/types';
import { GuildChannelBase } from './base-guild';
import type { PartialClass } from '../../utils/class';
import { createInstanceofGuard, createPartialClass } from '../../utils/class';

export class CategoryChannel<
  Data extends APIGuildCategoryChannel = APIGuildCategoryChannel
> extends GuildChannelBase<Data> {
  static is = createInstanceofGuard(CategoryChannel);
}

export interface CategoryChannel<Data extends APIGuildCategoryChannel = APIGuildCategoryChannel> {
  fetch(): Promise<CategoryChannel>;
}

export type EmptyCategoryChannel = PartialClass<
  // Class, Required properties from `raw`, Allowed methods from class
  typeof CategoryChannel,
  'id',
  'id' | 'fetch' | 'delete'
>;
export const EmptyCategoryChannel = createPartialClass<EmptyCategoryChannel>(CategoryChannel);
