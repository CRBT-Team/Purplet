import Logger from '@paperdave/logger';
import type { GatewayIdentifyData } from 'discord-api-types/gateway';

export const debug = new Logger('gateway', { debug: true });

// zlib-sync is used for fast decompression of gzipped payloads.
export let zlib: typeof import('zlib-sync') | undefined;
// Erlpack is used for payload compression.
export let erlpack: typeof import('erlpack') | undefined;

if (typeof Bun === 'undefined') {
  try {
    zlib = (await import('zlib-sync')).default;
  } catch {}

  try {
    erlpack = (await import('erlpack')).default;
  } catch {}
}

export const decoder = new TextDecoder();

export interface GatewayOptions
  extends Pick<GatewayIdentifyData, 'token' | 'shard' | 'presence' | 'intents'> {
  gatewayURL?: string;
}

export function stripUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(stripUndefined);
  }
  if (obj && typeof obj === 'object') {
    const out: Record<PropertyKey, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        out[key] = stripUndefined(value);
      }
    }
    return out;
  }
  return obj;
}

export const supportsZlib = typeof zlib !== 'undefined';
export const supportsETF = typeof erlpack !== 'undefined';
