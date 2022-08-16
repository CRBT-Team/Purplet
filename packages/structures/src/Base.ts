import type { Rest } from '@purplet/rest';
import type { AllowedMentionsTypes } from 'discord-api-types/v10';

interface DefaultAllowedMentions {
  parse: Array<AllowedMentionsTypes | 'everyone' | 'roles' | 'users'>;
  repliedUser: boolean;
}

export interface Environment {
  rest: Rest;
  defaultAllowedMentions: DefaultAllowedMentions;
}

export class Base<RawData> {
  constructor(protected env: Environment, readonly raw: RawData) {}

  protected get rest() {
    return this.env.rest;
  }
}
