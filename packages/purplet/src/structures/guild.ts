import type { Immutable } from '@paperdave/utils';
import type { APIGuild } from 'purplet/types';
import { rest } from '../env';
import type { PartialClass } from '../utils/class';
import { createPartialClass } from '../utils/class';

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
