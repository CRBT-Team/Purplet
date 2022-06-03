import type { Immutable } from '@davecode/types';
import type { APIGuildMember } from 'discord-api-types/v10';

/** Structure for APIMember. */
export class Member {
  constructor(readonly raw: Immutable<APIGuildMember>) {}

  get id() {
    return this.raw.user!.id;
  }
}
