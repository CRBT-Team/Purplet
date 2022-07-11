import { deferred } from '@davecode/utils';
import { classifyEndpoint } from './classify-endpoint';
import { RequestData } from './types';

export interface QueueEntry {
  request: RequestData;
  bucketId: string;
  endpointId: string;
  majorId: string;
  resolve: (data: any) => void;
  reject: (error: Error) => void;
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
export class Fetcher {
  #buckets = new Map<string, Bucket>();
  #bucketIds = new Map<string, string>();

  #lastSecond = Date.now();
  #globalCount = 0;
  #globalRateLimited?: QueueEntry[];

  queue<Output>(request: RequestData) {
    const { endpointId, majorId } = classifyEndpoint(
      request.url.pathname.match(/^\/api(?:\/v\d+)?(\/.*)/)![1],
      request.init.method ?? 'GET'
    );

    const bucketId = this.#bucketIds.get(endpointId) || endpointId;

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

    return promise;
  }

  private setBucketTimer(bucket: Bucket, subBucket: SubBucket) {
    if (subBucket.refresh === Infinity) {return;}
    if (subBucket.timer) {return;}
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

  private async runRequest(entry: QueueEntry, ignoreGlobal = false) {
    if (!ignoreGlobal) {
      if (!this.#globalRateLimited) {
        this.#globalCount++;
        const now = Date.now();
        if (this.#globalCount > 2) {
          this.#globalRateLimited = [];
          setTimeout(() => {
            const toRun = this.#globalRateLimited!.splice(0, 2);
            this.#globalCount = toRun.length;
            if (this.#globalRateLimited!.length === 0) {
              this.#globalRateLimited = undefined;
            }
            toRun.forEach(queueEntry => this.runRequest(queueEntry, true).catch(entry.reject));
          }, 1100);
        }
        if (now - this.#lastSecond > 1000) {
          this.#globalCount = 0;
          this.#lastSecond = now;
        }
      }
      if (this.#globalRateLimited) {
        return this.#globalRateLimited.push(entry);
      }
    }

    const bucket = this.#buckets.get(entry.bucketId)!;
    const subBucket = bucket.sub.get(entry.majorId)!;

    const req = entry.request;
    const response = await fetch(req.url.toString(), req.init);

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
      subBucket.refresh = parseInt(xReset!, 10) * 1000;

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
      return entry.resolve(await response.json());
    }

    if (response.status === 429) {
      const { global } = await response.json();
      // TODO: handle `global` properly
      // eslint-disable-next-line consistent-return
      return;
    }

    // console.log(response.status);
    // console.log(req);
    // console.log(await response.json());

    // TODO: custom error object, handle certain types of errors
    throw new Error(`${response.status} ${response.statusText}`);
  }
}
