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

    console.log(...response.headers.entries());

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
        (options.query ? `?${new URLSearchParams(options.query)}` : '')
    );

    const headers = new Headers(options.headers);
    if (options.auth !== false) {
      headers.set('Authorization', `${this.options.tokenType} ${this.options.token}`);
    }
    if (!headers.has('User-Agent')) {
      headers.set('User-Agent', this.options.userAgent);
    }

    let body: BodyInit | undefined = options.body ? JSON.stringify(options.body) : undefined;

    if (options.files && options.files.length > 0) {
      // Files are to be sent as multipart/form-data as specified by
      // https://discord.com/developers/docs/reference#uploading-files
      const form = new FormData();

      if (body) {
        console.log('body', body);
        form.append('payload_json', body);
      }

      for (const [index, file] of options.files.entries()) {
        form.append(
          file.key ?? `files[${index}]`,
          new Blob([file.data instanceof Uint8Array ? file.data.buffer : file.data]),
          file.name
        );
      }

      body = form;
    } else if (body) {
      // JSON body is to be sent as application/json
      headers.set('Content-Type', 'application/json');
    }

    if (options.reason?.length) {
      headers.set('X-Audit-Log-Reason', options.reason);
    }

    return this.queueRequest({
      url: url.toString(),
      init: {
        method: options.method,
        body,
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
