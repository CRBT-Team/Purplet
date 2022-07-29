import { Emitter } from '@paperdave/events';
import type {
  GatewayIdentifyData,
  GatewayPresenceUpdateData,
  GatewayReceivePayload,
  GatewaySendPayload,
} from 'discord-api-types/gateway';
import {
  GatewayCloseCodes,
  GatewayDispatchEvents,
  GatewayOpcodes,
  GatewayVersion,
} from 'discord-api-types/gateway';
import { RouteBases, Routes } from 'discord-api-types/v10';
import type { Inflate } from 'zlib-sync';
import type { GatewayEventMap } from './GatewayEventMap';
import { GatewayExitError } from './GatewayExitError';
import { Heartbeater } from './Heartbeater';

// zlib-sync is used for fast decompression of gzipped payloads.
let zlib: typeof import('zlib-sync') | undefined;
// Erlpack is used for payload compression.
let erlpack: typeof import('erlpack') | undefined;

// @ts-expect-error I cannot use bun-types or else the rest of the library gets type errors.
if (typeof Bun === 'undefined') {
  try {
    zlib = (await import('zlib-sync')).default;
  } catch {}

  try {
    erlpack = (await import('erlpack')).default;
  } catch {}
}

const decoder = new TextDecoder();

let gatewayURL: string | undefined;

export interface GatewayOptions
  extends Pick<GatewayIdentifyData, 'token' | 'shard' | 'presence' | 'intents'> {
  gateway?: string;
}

function stripUndefined(obj: any): any {
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

/**
 * Implementation of a Discord gateway client. Supports etf and zlib, if installed.
 *
 * Specs:
 *
 * - Pass an GatewayIdentifyData, immediately connects.
 * - Emits gateway events by name.
 * - Emits '*' event to catch all.
 * - `send()` to manually send packets.
 * - `updatePresence()` to update presence.
 */
// TODO: Request Guild Members
// TODO: voice support
export class Gateway extends Emitter<GatewayEventMap> {
  private seq = 0;
  private ws?: WebSocket;
  private hb?: Heartbeater;
  private sessionId: string | undefined;
  private inflate?: Inflate;
  private gotHello = false;

  constructor(public options: GatewayOptions) {
    super();
    this.connect();
  }

  /** Connects to the Gateway. */
  async connect() {
    let urlString = this.options.gateway ?? gatewayURL;

    if (!urlString) {
      // TODO: in the future, use /gateway/bot and automatic sharding.
      const { url } = await fetch(RouteBases.api + Routes.gateway()).then(x => x.json());
      urlString = url;
      // I honestly do not understand why this causes a race condition.
      // I hope it is a false positive.
      // eslint-disable-next-line require-atomic-updates
      gatewayURL = urlString;
    }

    if (zlib) {
      this.inflate = new zlib.Inflate({
        chunkSize: 65535,
      });
    }

    const url = new URL(urlString!);
    url.searchParams.set('v', GatewayVersion);
    url.searchParams.set('encoding', erlpack ? 'etf' : 'json');
    if (zlib) {
      url.searchParams.set('compress', 'zlib-stream');
    }

    this.gotHello = false;

    this.ws = new WebSocket(url.toString());
    // this.ws.binaryType = 'arraybuffer';
    this.ws.onmessage = event => this.onRawPacket(event.data);
    this.ws.onclose = event => this.onClose(event);
    this.ws.onerror = event => this.emit('error', new Error('WebSocket error: ' + event.target));

    // TODO: Remove this code once `https://github.com/Jarred-Sumner/bun/issues/521` is resolved.
    this.ws.onopen = () => {
      setTimeout(() => {
        if (!this.gotHello) {
          this.onPacket({ t: null, s: null, op: 10, d: { heartbeat_interval: 41250 } });
        }
      }, 250);
    };
  }

  /** Send a packet to the Gateway. */
  send(packet: GatewaySendPayload) {
    this.ws!.send((erlpack ? erlpack.pack : JSON.stringify)(stripUndefined(packet)));
  }

  /** @internal handles raw packets, decoding etf and gz */
  private onRawPacket(buf: string | Uint8Array) {
    let raw: Uint8Array | string;
    if (this.inflate) {
      const l = buf.length;
      // TODO: use a single equals check instead of four separate ones.
      const flush =
        l >= 4 &&
        buf[l - 4] === 0x00 &&
        buf[l - 3] === 0x00 &&
        buf[l - 2] === 0xff &&
        buf[l - 1] === 0xff;
      this.inflate.push(buf as Buffer, flush && zlib!.Z_SYNC_FLUSH);
      if (!flush) {
        return;
      }
      raw = this.inflate.result as Uint8Array;
    } else {
      raw = buf;
    }

    let packet;
    try {
      if (erlpack) {
        packet = erlpack.unpack(raw as Buffer);
      } else {
        packet = JSON.parse(typeof raw === 'string' ? raw : decoder.decode(raw));
      }
    } catch (error) {
      this.emit('error', error instanceof Error ? error : new Error(String(error)));
      return;
    }

    this.onPacket(packet as GatewayReceivePayload);
  }

  /** @internal handles close */
  private onClose({ code }: CloseEvent) {
    if (code >= 4000 && code <= 4999) {
      let reconnect = false;
      switch (code) {
        case GatewayCloseCodes.UnknownError:
          this.emit('debug', "WebSocket closed by Discord. We're not sure what went wrong.");
          reconnect = true;
          break;
        case GatewayCloseCodes.UnknownOpcode:
        case GatewayCloseCodes.DecodeError:
        case GatewayCloseCodes.NotAuthenticated:
        case GatewayCloseCodes.AlreadyAuthenticated:
          reconnect = true;
          break;
        case GatewayCloseCodes.InvalidAPIVersion:
        case GatewayCloseCodes.InvalidIntents:
        case GatewayCloseCodes.InvalidShard:
        case GatewayCloseCodes.AuthenticationFailed:
        case GatewayCloseCodes.ShardingRequired:
        case GatewayCloseCodes.DisallowedIntents:
          break;
        case GatewayCloseCodes.SessionTimedOut:
          this.emit('debug', 'WebSocket closed by Discord. Attempting to reconnect...');
          reconnect = true;
          break;
        case GatewayCloseCodes.InvalidSeq:
          // Do not log for this one
          this.sessionId = undefined;
          reconnect = true;
          break;
        default:
          break;
      }

      if (!reconnect) {
        this.emit('error', new GatewayExitError(code));
      } else {
        this.reconnect();
      }
    }
  }

  private onHeartbeat() {
    this.send({ op: GatewayOpcodes.Heartbeat, d: this.seq });
  }

  /** @internal handle decoded packet data */
  private onPacket(packet: GatewayReceivePayload) {
    if (packet.s) {
      this.seq = packet.s;
    }

    switch (packet.op) {
      case GatewayOpcodes.Hello:
        this.gotHello = true;
        this.hb = new Heartbeater(packet.d.heartbeat_interval, () => this.onHeartbeat());

        if (this.sessionId) {
          this.send({
            op: GatewayOpcodes.Resume,
            d: {
              seq: this.seq,
              session_id: this.sessionId,
              token: this.options.token,
            },
          });
        } else {
          this.send({
            op: GatewayOpcodes.Identify,
            d: {
              token: this.options.token,
              shard: this.options.shard,
              presence: this.options.presence,
              intents: this.options.intents,
              compress: !!zlib,
              properties: {
                os: typeof process !== 'undefined' ? process.platform : 'web',
                browser: 'purplet',
                device: 'purplet',
              },
            },
          });
        }
        return;
      case GatewayOpcodes.HeartbeatAck:
        // TODO: implement zombie detection
        return;
      case GatewayOpcodes.InvalidSession:
        this.emit('debug', 'Gateway Session Invalidated. Reconnecting.');
        this.reconnect();
        return;
      case GatewayOpcodes.Reconnect:
        this.reconnect();
        return;
      case GatewayOpcodes.Dispatch:
        if (packet.t === GatewayDispatchEvents.Ready) {
          this.sessionId = packet.d.session_id;
        }
        this.emit('*', packet);
        this.emit(packet.t, packet.d);
        return;
      case GatewayOpcodes.Heartbeat:
        this.hb!.beat();
    }
  }

  /** Reconnects. */
  async reconnect(newOptions: GatewayOptions = this.options) {
    this.close();
    this.options = newOptions;
    await this.connect();
  }

  /** Close and cleanup. */
  close() {
    this.ws?.close();
    this.hb?.close();
  }

  /** Update the bot's presence. */
  updatePresence(presence: GatewayPresenceUpdateData) {
    this.send({
      op: GatewayOpcodes.PresenceUpdate,
      d: presence,
    });
  }
}
