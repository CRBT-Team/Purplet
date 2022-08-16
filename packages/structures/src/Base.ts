import type { Rest } from '@purplet/rest';
import type { AllowedMentionsTypes } from 'discord-api-types/v10';

export interface DefaultAllowedMentions {
  parse: Array<AllowedMentionsTypes | 'everyone' | 'roles' | 'users'>;
  repliedUser: boolean;
}

export interface Environment {
  rest: Rest;
  // defaultAllowedMentions: DefaultAllowedMentions;
}

export class Base<RawData> {
  constructor(readonly raw: RawData) {}

  protected static env: Environment;

  protected static get rest() {
    return this.env.rest;
  }

  protected get env() {
    return (this.constructor as any).env as Environment;
  }

  protected get rest() {
    return this.env.rest;
  }
}

/** Decorator for future use. */
export function cached() {}
