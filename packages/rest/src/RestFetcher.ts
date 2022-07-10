import { APIVersion, RouteBases } from 'discord-api-types/rest';
import { RequestData, RequestOptions, RequestOptionsWithMethod, RestOptions } from './types';

const sourceURL = 'https://github.com/CRBT-Team/Purplet/tree/main/packages/rest';
// TODO: Add rollup define plugin for __VERSION__, like we have in main purplet package.
const version = '1.0.0';
const defaultUserAgent = `DiscordBot (${sourceURL}, ${version})`;

/** Implements fetching Discord API endpoints, given endpoints and options. */
export class RestFetcher {
  options: Required<RestOptions>;

  constructor(options: RestOptions) {
    this.options = {
      version: APIVersion,
      base: RouteBases.api,
      tokenType: 'Bot',
      userAgent: defaultUserAgent,
      ...options,
    };

    const versionSuffix = `/v${this.options.version}`;
    if (this.options.base.endsWith(versionSuffix)) {
      this.options.base = this.options.base.slice(0, -versionSuffix.length);
    }
  }

  private async runRequest(req: RequestData) {
    const response = await fetch(req.url, req.init);

    if (response.ok) {
      return response.json();
    }

    if (response.status === 429) {
      const { retry_after: retryAfter, global } = await response.json();
      // TODO: Reschedule
      throw new Error('429 Ratelimited. ');
    }

    console.log(response.status);
    console.log(req);
    console.log(await response.json());

    // TODO: custom error object, handle certain types of errors
    throw new Error(`${response.status} ${response.statusText}`);
  }

  private async queueRequest(req: RequestData) {
    // TODO: queue
    return this.runRequest(req);
  }

  async request<Output>(endpoint: string, options: RequestOptionsWithMethod): Promise<Output> {
    const url = new URL(
      this.options.base +
        (endpoint.startsWith('/oauth2') ? '' : `/v${this.options.version}`) +
        endpoint +
        (options.query ? `?${new URLSearchParams(options.query).toString()}` : '')
    );

    const headers = new Headers(options.headers);
    if (options.auth !== false) {
      headers.set('Authorization', `${this.options.tokenType} ${this.options.token}`);
    }
    // TODO: Uploading Files (https://discord.com/developers/docs/reference#uploading-files)
    if (options.body && !(options.files && options.files.length > 0)) {
      headers.set('Content-Type', 'application/json');
    }
    if (!headers.has('User-Agent')) {
      headers.set('User-Agent', this.options.userAgent);
    }

    return this.queueRequest({
      url: url.toString(),
      init: {
        method: options.method,
        body: options.body ? JSON.stringify(options.body) : undefined,
        headers,
      },
    });
  }

  // Useful method aliases

  get<Output>(endpoint: string, options?: RequestOptions): Promise<Output> {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  post<Output>(endpoint: string, options?: RequestOptions): Promise<Output> {
    return this.request(endpoint, { method: 'POST', ...options });
  }

  put<Output>(endpoint: string, options?: RequestOptions): Promise<Output> {
    return this.request(endpoint, { method: 'PUT', ...options });
  }

  delete<Output>(endpoint: string, options?: RequestOptions): Promise<Output> {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  patch<Output>(endpoint: string, options?: RequestOptions): Promise<Output> {
    return this.request<Output>(endpoint, { method: 'PATCH', ...options });
  }
}