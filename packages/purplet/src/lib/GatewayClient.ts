import EventEmitter from 'events';
import { deferred } from '@davecode/utils';
import { REST } from '@discordjs/rest';
import {
  GatewayCloseCodes,
  GatewayDispatchEvents,
  GatewayIdentifyData,
  GatewayOpcodes,
  GatewayPresenceUpdateData,
  GatewayReadyDispatchData,
  GatewayReceivePayload,
  GatewaySendPayload,
  GatewayVersion,
} from 'purplet/types';
import { WebSocket } from 'ws';
import type { Inflate } from 'zlib-sync';
import { GatewayClientExitError } from './errors';
import { Heartbeater } from './Heartbeater';
import { errorFromGatewayClientExitError } from '../cli/errors';

// zlib-sync is used for fast decompression of gzipped payloads.
let zlib: typeof import('zlib-sync') | undefined = undefined;
try {
  zlib = (await import('zlib-sync')).default;
} catch {}

// Erlpack is used for faster encoding/decoding of payloads.
let erlpack: typeof import('erlpack') | undefined = undefined;
try {
  erlpack = (await import('erlpack')).default;
} catch {}

const decoder = new TextDecoder();

let gatewayURL: string | undefined;

export interface GatewayClientOptions
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
      if (value !== undefined) out[key] = stripUndefined(value);
    }
    return out;
  }
  return obj;
}

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
export class GatewayClient extends EventEmitter {
  private seq = 0;
  private ws?: WebSocket;
  private hb?: Heartbeater;
  private sessionId: string | undefined;
  private inflate?: Inflate;

  constructor(public options: GatewayClientOptions) {
    super();
    this.connect();
  }

  /** Connects to the Gateway. */
  private async connect() {
    let urlString = this.options.gateway ?? gatewayURL;

    if (!urlString) {
      // TODO: in the future, use /gateway/bot and automatic sharding.
      urlString = gatewayURL = await new REST()
        .get('/gateway', { auth: false })
        .then(res => (res as { url: string }).url);
    }

    if (zlib) {
      this.inflate = new zlib.Inflate({
        chunkSize: 65535,
      });
    }

    const url = new URL(urlString!);
    url.searchParams.set('v', GatewayVersion);
    url.searchParams.set('encoding', erlpack ? 'etf' : 'json');
    if (zlib) url.searchParams.set('compress', 'zlib-stream');

    this.ws = new WebSocket(url, { handshakeTimeout: 30000 });
    this.ws.on('message', this.onRawMessage.bind(this));
    this.ws.on('error', error => {
      this.emit('error', error);
    });
    this.ws.on('close', code => {
      if (code >= 4000 && code <= 4999) {
        let reconnect = false;
        switch (code) {
          case GatewayCloseCodes.UnknownError:
            console.error("WebSocket closed by Discord. We're not sure what went wrong.");
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
            console.error('WebSocket closed by Discord. Attempting to reconnect...');
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
          this.emit('error', new GatewayClientExitError(code));
        } else {
          this.reconnect();
        }
      }
    });
  }

  /** Send a packet to the Gateway. */
  send(packet: GatewaySendPayload) {
    this.ws!.send((erlpack ? erlpack.pack : JSON.stringify)(stripUndefined(packet)));
  }

  /** @internal handles raw packets, decoding etf and gz */
  private onRawMessage(buf: Buffer) {
    let raw: Buffer | string;
    if (this.inflate) {
      const l = buf.length;
      const flush =
        l >= 4 &&
        buf[l - 4] === 0x00 &&
        buf[l - 3] === 0x00 &&
        buf[l - 2] === 0xff &&
        buf[l - 1] === 0xff;
      this.inflate.push(buf, flush && zlib!.Z_SYNC_FLUSH);
      if (!flush) return;
      raw = this.inflate.result as Buffer;
    } else {
      raw = buf;
    }

    let packet;
    try {
      if (erlpack) {
        packet = erlpack.unpack(raw);
      } else {
        packet = JSON.parse(decoder.decode(raw));
      }
    } catch (error) {
      console.error('error decoding');
      console.error(error);
      return;
    }

    this.onPacket(packet as GatewayReceivePayload);
  }

  /** @internal handle decoded packet data */
  private async onPacket(packet: GatewayReceivePayload) {
    if (packet.s) {
      this.seq = packet.s;
    }

    switch (packet.op) {
      case GatewayOpcodes.Hello:
        this.hb = new Heartbeater(packet.d.heartbeat_interval, () =>
          this.send({ op: GatewayOpcodes.Heartbeat, d: this.seq })
        );

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
                os: process.platform,
                browser: 'purplet/v__VERSION__',
                device: 'purplet/v__VERSION__',
              },
            },
          });
        }
        return;
      case GatewayOpcodes.HeartbeatAck:
        // TODO: implement zombie detection
        console.debug('heartbeat ack, thanks', packet);
        return;
      case GatewayOpcodes.InvalidSession:
        console.warn('Gateway Session Invalidated. Reconnecting.');
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
        return;
    }
  }

  /** Reconnects. */
  async reconnect(newOptions: GatewayClientOptions = this.options) {
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

export type CreateGatewayClientResult = [GatewayClient, GatewayReadyDispatchData];

export async function createGatewayClient(identify: GatewayClientOptions) {
  const [promise, resolve, reject] = deferred<CreateGatewayClientResult>();

  const client = new GatewayClient(identify);

  function errorHandler(e: Error) {
    if (e instanceof GatewayClientExitError) {
      reject(errorFromGatewayClientExitError(e, client));
    } else {
      reject(e);
    }
  }

  function readyHandler(ready: GatewayReadyDispatchData) {
    resolve([client, ready]);
    client.removeListener('error', errorHandler);
    client.removeListener(GatewayDispatchEvents.Ready, readyHandler);
  }

  client.on('error', errorHandler);
  client.on(GatewayDispatchEvents.Ready, readyHandler);

  return promise;
}
