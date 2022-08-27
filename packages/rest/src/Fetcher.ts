import { deferred } from '@paperdave/utils';
import { DiscordAPIError } from './DiscordAPIError';
import type { RequestData } from './types';
import { classifyEndpoint } from './utils';

export interface Error429 {
  message: string;
  retry_after: number;
  global: boolean;
}

export interface QueueEntry {
  request: RequestData;
  bucketId: string;
  endpointId: string;
  majorId: string;
  resolve(data?: any): void;
  reject(error: Error): void;
}

export interface Bucket {
  limit: number;
  sub: Map<string, SubBucket>;
}

export interface SubBucket {
  remaining: number;
  refresh: number;
  queue: QueueEntry[];
  running: boolean;
  timer?: ReturnType<typeof setTimeout> | undefined;
}

/** Implements fetching Discord API endpoints, given endpoints and options. */
// TODO: handle the 10000 errors per 10 min limit
export class Fetcher {
  #buckets = new Map<string, Bucket>();
  #bucketIds = new Map<string, string>();

  #lastSecond = Date.now();
  #globalCount = 0;
  #globalRateLimited?: QueueEntry[];

  async queue<Output>(request: RequestData) {
    const { endpointId, majorId } = classifyEndpoint(
      /^\/api(?:\/v\d+)?(\/.*)/.exec(request.url.pathname)![1],
      request.init.method ?? 'GET'
    );

    const bucketId = this.#bucketIds.get(endpointId) ?? endpointId;

    const [promise, resolve, reject] = deferred<Output>();
    const entry = { request, resolve, reject, bucketId, endpointId, majorId };

    let bucket = this.#buckets.get(bucketId);
    let subBucket: SubBucket;

    if (!bucket) {
      bucket = { limit: 1, sub: new Map() };
      subBucket = { remaining: 1, refresh: Infinity, queue: [], running: false };
      bucket.sub.set(majorId, subBucket);
      this.#buckets.set(bucketId, bucket);
    } else {
      subBucket = bucket.sub.get(majorId)!;
      if (!subBucket) {
        subBucket = { remaining: 1, refresh: Infinity, queue: [], running: false };
        bucket.sub.set(majorId, subBucket);
      }
    }

    if (subBucket.remaining === 0 || subBucket.running) {
      subBucket.queue.push(entry);
      this.setBucketTimer(bucket, subBucket);
    } else {
      subBucket.remaining--;
      subBucket.running = true;
      this.runRequest(entry).catch(reject);
    }

    return await promise;
  }

  private setBucketTimer(bucket: Bucket, subBucket: SubBucket) {
    if (subBucket.refresh === Infinity) {
      return;
    }
    if (subBucket.timer) {
      return;
    }
    subBucket.timer = setTimeout(() => {
      subBucket.timer = undefined;
      subBucket.remaining = bucket.limit;
      subBucket.refresh = Infinity;
      if (subBucket.queue.length > 0) {
        subBucket.remaining--;
        const entry = subBucket.queue.shift()!;
        this.runRequest(entry).catch(entry.reject);
      }
    }, subBucket.refresh - Date.now());
  }

  private setGlobalTimer(time: number) {
    setTimeout(() => {
      const toRun = this.#globalRateLimited!.splice(0, 49);
      this.#globalCount = toRun.length;
      if (this.#globalRateLimited!.length === 0) {
        this.#globalRateLimited = undefined;
      }
      for (const queueEntry of toRun) {
        this.runRequest(queueEntry, true).catch(queueEntry.reject);
      }
    }, time);
  }

  private async runRequest(entry: QueueEntry, ignoreGlobal = false): Promise<void> {
    if (!ignoreGlobal) {
      if (!this.#globalRateLimited) {
        this.#globalCount++;
        const now = Date.now();
        if (this.#globalCount > 49) {
          this.#globalRateLimited = [];
          this.setGlobalTimer(1000);
        }
        if (now - this.#lastSecond > 1000) {
          this.#globalCount = 0;
          this.#lastSecond = now;
        }
      }
      if (this.#globalRateLimited) {
        this.#globalRateLimited.push(entry);
        return;
      }
    }

    const bucket = this.#buckets.get(entry.bucketId)!;
    const subBucket = bucket.sub.get(entry.majorId)!;

    const req = entry.request;
    const response = await fetch(req.url.toString(), req.init);

    const serverNow = response.headers.has('Date')
      ? new Date(response.headers.get('Date')!).getTime()
      : Date.now();
    const ourNow = Date.now();
    const timeOffset = ourNow - serverNow;

    const xReset = response.headers.get('X-RateLimit-Reset');
    const xBucket = response.headers.get('X-RateLimit-Bucket');
    const xLimit = response.headers.get('X-RateLimit-Limit');
    const xRemaining = response.headers.get('X-RateLimit-Remaining');

    if (xBucket) {
      if (xBucket !== entry.bucketId) {
        this.#buckets.set(xBucket, bucket);
        this.#buckets.delete(entry.bucketId);
        this.#bucketIds.set(entry.endpointId, xBucket);
        bucket.sub.forEach(sBucket => {
          sBucket.queue.forEach(obj => {
            obj.bucketId = xBucket;
          });
        });
      }

      bucket.limit = parseInt(xLimit!, 10);
      subBucket.remaining = parseInt(xRemaining!, 10);
      subBucket.refresh = Number(xReset!) * 1000 - timeOffset;

      if (subBucket.queue.length > 0) {
        if (subBucket.remaining === 0) {
          this.setBucketTimer(bucket, subBucket);
        } else {
          subBucket.remaining--;
          const queueEntry = subBucket.queue.shift()!;
          this.runRequest(queueEntry).catch(queueEntry.reject);
        }
      } else {
        subBucket.running = false;
      }
    }

    if (response.ok) {
      response.status === 204 ? entry.resolve() : entry.resolve(await response.json());
      return;
    }

    if (response.status === 429) {
      const { global, retry_after } = (await response.json()) as Error429;
      if (global) {
        this.#globalRateLimited = [entry];
        this.setGlobalTimer(retry_after - timeOffset);
      } else {
        subBucket.remaining = 0;
        subBucket.refresh = retry_after * 1000 - timeOffset;
        subBucket.queue.unshift(entry);
        this.setBucketTimer(bucket, subBucket);
      }
      return;
    }

    const text = await response.text();
    let error;
    try {
      error = new DiscordAPIError(JSON.parse(text), response);
    } catch (e) {
      error = new Error(text);
    }
    throw error;
  }
}
