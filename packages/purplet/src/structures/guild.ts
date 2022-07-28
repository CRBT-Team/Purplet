import type { Immutable } from '@davecode/types';
import type { APIGuild } from 'purplet/types';
import { rest } from '../env';
import { createPartialClass, PartialClass } from '../utils/class';

/** Structure for APIGuild. */
export class Guild {
  constructor(readonly raw: Immutable<APIGuild>) {}

  async fetch() {
    return new Guild(await rest.guild.getGuild({ guildId: this.id }));
  }

  get id() {
    return this.raw.id;
  }
}

export type EmptyGuild = PartialClass<
  // Class, Required properties from `raw`, Allowed methods from class
  typeof Guild,
  'id',
  'id' | 'fetch'
>;
export const EmptyGuild = createPartialClass<EmptyGuild>(Guild);
