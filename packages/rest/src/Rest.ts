import * as routes from './routes/index';
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

  applicationCommand = routes.applicationCommand(this);
  interactionResponse = routes.interactionResponse(this);
  auditLog = routes.auditLog(this);
  autoModeration = routes.autoModeration(this);
  channel = routes.channel(this);
  emoji = routes.emoji(this);
  guild = routes.guild(this);
  guildScheduledEvent = routes.guildScheduledEvent(this);
  guildTemplate = routes.guildTemplate(this);
  invite = routes.invite(this);
  stageInstance = routes.stageInstance(this);
  sticker = routes.sticker(this);
  user = routes.user(this);
  voice = routes.voice(this);
  webhook = routes.webhook(this);
  gateway = routes.gateway(this);
  oauth2 = routes.oauth2(this);
}
