import type { Immutable } from '@davecode/types';
import { APIGuild, Routes } from 'discord-api-types/v10';
import { rest } from '../lib/global';
import { createPartialClass, PartialClass } from '../utils/partial';

/** Structure for APIGuild. */
export class Guild {
  constructor(readonly raw: Immutable<APIGuild>) {}

  async fetch() {
    return new Guild((await rest.get(Routes.guild(this.id))) as APIGuild);
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
