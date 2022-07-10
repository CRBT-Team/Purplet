import { RestFetcher } from './RestFetcher';
import { RestOptions, TokenType } from './types';

export class Rest {
  // Most of our logic is actually in the fetcher
  readonly fetcher: RestFetcher;

  constructor(options: RestOptions) {
    this.fetcher = new RestFetcher(options);
  }

  get options() {
    return this.fetcher.options;
  }

  setToken(token: string, tokenType: TokenType) {
    this.fetcher.options.token = token;
    this.fetcher.options.tokenType = tokenType;
    return this;
  }

  auditLog: unknown;
  autoModeration: unknown;
  channel: unknown;
  emoji: unknown;
  guild: unknown;
  guildScheduledEvent: unknown;
  guildTemplate: unknown;
  invite: unknown;
  stageInstance: unknown;
  sticker: unknown;
  user: unknown;
  voice: unknown;
  webhook: unknown;
}
