import type { Immutable } from '@davecode/types';
import { REST } from '@discordjs/rest';
import { APIGuild, Routes } from 'purplet/types';
import { rest } from '../lib/global';
import { createPartialClass, PartialClass } from '../utils/class';

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

const restclient = new REST({ }).setToken("token") //id prefer if token was just a property passed to constructor

restclient.post('/some url', {
  body: {
    json_body: true
  },
  query: new URLSearchParams(),
  headers: {
    // headers
  },
  files: [
    {
      data: new Uint8Array(), // i guess allow string, arraybuffer, or whatever you want.
      name: 'filename'
    }
  ],
  reason: '', // this is translated to X-Audit-Log-Reason header
})