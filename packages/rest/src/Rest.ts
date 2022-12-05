import { API_BASE_URL, API_VERSION, toBlob } from '@purplet/utils';
import { Fetcher } from './Fetcher';
import {
  ApplicationCommand,
  AuditLog,
  AutoModeration,
  Channel,
  Emoji,
  Gateway,
  Guild,
  GuildScheduledEvent,
  GuildTemplate,
  InteractionResponse,
  Invite,
  Oauth2,
  StageInstance,
  Sticker,
  User,
  Voice,
  Webhook,
} from './routes.generated';
import type { RequestOptions, RequestOptionsWithMethod, RestOptions, TokenType } from './types';

const sourceURL = 'https://github.com/CRBT-Team/Purplet/tree/main/packages/rest';
const version = '__VERSION__';
const defaultUserAgent = `DiscordBot (${sourceURL}, ${version})`;

const methodsWithBody = new Set(['POST', 'PUT', 'PATCH']);

export class Rest {
  options: Required<RestOptions>;

  // Most of our logic is actually in the fetcher
  readonly fetcher: Fetcher;

  constructor(options: RestOptions) {
    this.options = {
      version: API_VERSION,
      base: API_BASE_URL,
      tokenType: 'Bot',
      userAgent: defaultUserAgent,
      fetch,
      ...options,
    };

    const versionSuffix = `/v${this.options.version}`;
    if (this.options.base.endsWith(versionSuffix)) {
      this.options.base = this.options.base.slice(0, -versionSuffix.length);
    }

    this.fetcher = new Fetcher(this.options.fetch);
  }

  setToken(token: string, tokenType: TokenType = 'Bot') {
    this.options.token = token;
    this.options.tokenType = tokenType;
    return this;
  }

  // The following properties have to be typed explicitly or else bundling will break
  // and inline all the types, which will not preserve jsdoc information

  applicationCommand: ApplicationCommand = new ApplicationCommand(this);
  interactionResponse: InteractionResponse = new InteractionResponse(this);
  auditLog: AuditLog = new AuditLog(this);
  autoModeration: AutoModeration = new AutoModeration(this);
  channel: Channel = new Channel(this);
  emoji: Emoji = new Emoji(this);
  guild: Guild = new Guild(this);
  guildScheduledEvent: GuildScheduledEvent = new GuildScheduledEvent(this);
  guildTemplate: GuildTemplate = new GuildTemplate(this);
  invite: Invite = new Invite(this);
  stageInstance: StageInstance = new StageInstance(this);
  sticker: Sticker = new Sticker(this);
  user: User = new User(this);
  voice: Voice = new Voice(this);
  webhook: Webhook = new Webhook(this);
  gateway: Gateway = new Gateway(this);
  oauth2: Oauth2 = new Oauth2(this);

  /** Runs a request against the Discord API. */
  async request<Output>(endpoint: string, options: RequestOptionsWithMethod): Promise<Output> {
    const query = Object.entries(options.query ?? {})
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');

    const url = new URL(
      this.options.base +
        (endpoint.startsWith('/oauth2') ? '' : `/v${this.options.version}`) +
        endpoint +
        (query ? `?${query}` : '')
    );

    const headers = new Headers(options.headers);
    if (options.auth !== false) {
      headers.set('Authorization', `${this.options.tokenType} ${this.options.token}`);
    }
    if (!headers.has('User-Agent')) {
      headers.set('User-Agent', this.options.userAgent);
    }

    let body: BodyInit | undefined = options.body
      ? JSON.stringify(options.body)
      : methodsWithBody.has(options.method)
      ? '{}'
      : undefined;

    if (options.files && options.files.length > 0) {
      // Files are to be sent as multipart/form-data as specified by
      // https://discord.com/developers/docs/reference#uploading-files
      const form = new FormData();

      if (body) {
        form.append('payload_json', body);
      }

      for (const [index, file] of options.files.entries()) {
        form.append(file.key ?? `files[${index}]`, await toBlob(file.data), file.name);
      }

      body = form;
    } else if (body) {
      // JSON body is to be sent as application/json
      headers.set('Content-Type', 'application/json');
    }

    if (options.reason?.length) {
      headers.set('X-Audit-Log-Reason', options.reason);
    }

    return this.fetcher.queue({
      url,
      init: {
        method: options.method,
        body,
        headers,
      },
    });
  }

  // Useful method aliases

  async get<Output>(endpoint: string, options?: RequestOptions): Promise<Output> {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  async post<Output>(endpoint: string, options?: RequestOptions): Promise<Output> {
    return this.request(endpoint, { method: 'POST', ...options });
  }

  async put<Output>(endpoint: string, options?: RequestOptions): Promise<Output> {
    return this.request(endpoint, { method: 'PUT', ...options });
  }

  async delete<Output>(endpoint: string, options?: RequestOptions): Promise<Output> {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  async patch<Output>(endpoint: string, options?: RequestOptions): Promise<Output> {
    return this.request<Output>(endpoint, { method: 'PATCH', ...options });
  }
}
