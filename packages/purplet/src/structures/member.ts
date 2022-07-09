import type { Immutable } from '@davecode/types';
import type { APIGuildMember } from 'purplet/types';

/** Structure for APIMember. */
export class Member {
  constructor(readonly raw: Immutable<APIGuildMember>) {}

  get id() {
    return this.raw.user!.id;
  }
}
