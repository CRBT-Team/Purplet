import type { Snowflake } from 'discord-api-types/globals';

const SWR_MAX_AGE = 1 * 60 * 60 * 1000; // 1 hour
const SWR_STALE_TIME = 5 * 60 * 1000; // 5 minutes
// const SWR_STALE_TIME = 1000; // 1 second
const SWEEP_INTERVAL = 5 * 60 * 1000; // 5 minutes

export interface Cache<T> {
  /** Fetch an item from the cache. If `force` is set, new data must be fetched. */
  fetch(key: Snowflake, force?: boolean): Promise<T>;
  /** Get an item from the cache, returns `undefined` if the item is not cached. */
  get(key: Snowflake): T | undefined;
  /** Set an item in the cache. */
  set(key: Snowflake, value: T): void;
  /** Delete an item from the cache. */
  delete(key: Snowflake): boolean;
  /** Sweeps the cache for expired items. Called automatically every by the framework. */
  sweep?(): void;
  /** Number of items in the cache. If reports 0, the cache may be deleted. */
  size: number;
}

export type Fetcher<X> = (id: Snowflake) => Promise<X>;
export type ResolveKey<X> = (data: X, id: Snowflake) => string;
export type CacheFactory<X = unknown> = (
  fetcher: Fetcher<X>,
  resolveKey: ResolveKey<X>
) => Cache<X>;

let cacheFactory: CacheFactory = (fetcher, resolveKey) => new DefaultCache(fetcher, resolveKey);

export function setCacheFactory(factory: () => Cache<any>) {
  cacheFactory = factory;
}

class DefaultCache<T> implements Cache<T> {
  private readonly fetcher: Fetcher<T>;
  private readonly resolveKey: ResolveKey<T>;
  private readonly cache: Map<Snowflake, T>;
  private readonly expires: Map<Snowflake, number>;

  constructor(fetcher: Fetcher<T>, resolveKey: ResolveKey<T>) {
    this.fetcher = fetcher;
    this.resolveKey = resolveKey;
    this.cache = new Map();
    this.expires = new Map();
  }

  async fetch(key: Snowflake, force = false): Promise<T> {
    if (!force) {
      const cached = this.get(key);
      const expires = this.expires.get(key)!;
      if (cached) {
        // todo: i wasn't getting this logic right
        return cached;
      }
    }

    return this.fetcher(key).then(value => {
      this.set(this.resolveKey(value, key), value);
      return value;
    });
  }

  get(key: Snowflake) {
    return this.cache.get(key);
  }

  set(key: Snowflake, value: T) {
    this.cache.set(key, value);
    this.expires.set(key, Date.now() + SWR_MAX_AGE);
  }

  delete(key: Snowflake) {
    this.expires.delete(key);
    return this.cache.delete(key);
  }

  sweep() {
    const now = Date.now();
    for (const [key, expire] of this.expires) {
      if (expire < now) {
        this.delete(key);
      }
    }
  }

  get size() {
    return this.cache.size;
  }
}

const caches = new Map<string, Cache<unknown>>();

const defaultResolveKey: ResolveKey<any> = (data, id) => id;

export function getCache<X>(
  key: string,
  fetcher: Fetcher<X>,
  resolveKey: ResolveKey<X> = defaultResolveKey
): Cache<X> {
  let cache = caches.get(key);
  if (!cache) {
    cache = cacheFactory(fetcher, resolveKey as ResolveKey<any>);
    caches.set(key, cache);
    // TODO: setup sweeps
  }
  return cache as Cache<X>;
}

/** Generates a cache proxy. */
export function createCache<X>(type: string, fetcher: Fetcher<X>, resolveKey: ResolveKey<X>) {
  return {
    async fetch(id: Snowflake, force = false) {
      return getCache(type, fetcher, resolveKey).fetch(id, force);
    },
    get(id: Snowflake) {
      return getCache(type, fetcher, resolveKey).get(id);
    },
    set(id: Snowflake, value: X) {
      getCache(type, fetcher, resolveKey).set(id, value);
    },
    delete(id: Snowflake) {
      return getCache(type, fetcher, resolveKey).delete(id);
    },
    sweep() {
      getCache(type, fetcher, resolveKey).sweep?.();
    },
    get size() {
      return getCache(type, fetcher, resolveKey).size;
    },
    async insert(data: X) {
      const id = resolveKey(data, '');
      this.set(id, data);
      return data;
    },
  };
}

// async function testFetcher(id: string) {
//   console.log('fetching', id);
//   return Promise.resolve({ id, at: Math.floor(Math.random() * 1000) });
// }

// const testCache = createCache('test', testFetcher);

// console.log(await testCache.fetch('1'));
// console.log(await testCache.fetch('2'));
// console.log(await testCache.fetch('1'));
// console.log(await testCache.fetch('1', true));
// await delay(2000);
// console.log(await testCache.fetch('2'));
// await delay(10);
// console.log(await testCache.fetch('2'));
