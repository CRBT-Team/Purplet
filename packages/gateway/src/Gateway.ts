import { Emitter } from '@paperdave/events';
import { Logger } from '@paperdave/logger';
import type {
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
import { getWSCodeDisplayName } from './status-code';
import type { GatewayOptions } from './util';
import { debug, decoder, erlpack, stripUndefined, zlib } from './util';
import { version } from '../package.json';

type GatewayState = 'connecting' | 'connected';

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
  private gatewayURL?: string;
  private state: GatewayState = 'connecting';
  options: GatewayOptions;

  constructor(options: GatewayOptions) {
    super();
    this.options = options;
    if (!this.options.token) {
      throw new Error('Empty token passed to new Gateway()');
    }
    if (this.options.intents === undefined) {
      throw new Error('Empty intents passed to new Gateway()');
    }
    this.connect();
  }

  /** Connects to the Gateway. */
  async connect() {
    let urlString = this.options.gatewayURL ?? this.gatewayURL;

    if (!urlString) {
      // TODO: in the future, use /gateway/bot and automatic sharding.
      const { url } = (await fetch(RouteBases.api + Routes.gateway()).then(x => x.json())) as any;
      urlString = this.gatewayURL = url;
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

    this.ws = new WebSocket(url.toString());
    this.ws.onmessage = event => this.onRawPacket(event.data);
    this.ws.onclose = event => this.onClose(event);
    this.ws.onerror = event => this.emit('error', new Error('WebSocket error: ' + event.target));
  }

  /** Send a packet to the Gateway. */
  send(packet: GatewaySendPayload) {
    this.ws!.send((erlpack ? erlpack.pack : JSON.stringify)(stripUndefined(packet)));
  }

  private sendIdentify() {
    if (this.sessionId) {
      debug('sending resume, seq=%s', this.seq);
      this.send({
        op: GatewayOpcodes.Resume,
        d: {
          seq: this.seq,
          session_id: this.sessionId,
          token: this.options.token,
        },
      });
    } else {
      debug('sending identify, intents=%s', this.options.intents);
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
            browser: `@purplet/gateway ${version}`,
            device: `@purplet/gateway ${version}`,
          },
        },
      });
    }
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
    if (code === 1000) {
      return;
    }

    let reconnect = false;
    debug(`WebSocket disconnected: ${getWSCodeDisplayName(code)} ${code}`);

    switch (code) {
      case 1015: // Failed Handshake
      case GatewayCloseCodes.InvalidAPIVersion:
      case GatewayCloseCodes.InvalidIntents:
      case GatewayCloseCodes.InvalidShard:
      case GatewayCloseCodes.AuthenticationFailed:
      case GatewayCloseCodes.ShardingRequired:
      case GatewayCloseCodes.DisallowedIntents:
        break;
      case 1001: // Server going down
      case 1002: // Protocol Error
      case 1006: // Network loss
      case GatewayCloseCodes.UnknownError:
      case GatewayCloseCodes.SessionTimedOut:
      case GatewayCloseCodes.UnknownOpcode:
      case GatewayCloseCodes.DecodeError:
      case GatewayCloseCodes.NotAuthenticated:
      case GatewayCloseCodes.AlreadyAuthenticated:
        reconnect = true;
        break;
      case GatewayCloseCodes.InvalidSeq:
        this.seq = 0;
        this.sessionId = undefined;
        reconnect = true;
        break;
      default:
        Logger.error(`purplet gateway: unknown close code ${code}`);
        break;
    }

    if (reconnect) {
      this.reconnect();
    } else {
      this.emit('error', new GatewayExitError(code));
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
        debug('Hello, heartbeat interval is %sms.', packet.d.heartbeat_interval);
        this.hb = new Heartbeater(packet.d.heartbeat_interval, () => this.onHeartbeat());
        this.sendIdentify();
        return;
      case GatewayOpcodes.HeartbeatAck:
        debug('Recieved heartbeat ack');
        // TODO: implement zombie detection
        return;
      case GatewayOpcodes.InvalidSession:
        if (this.state === 'connecting') {
          this.close();
          this.onClose({ code: GatewayCloseCodes.AuthenticationFailed });
          return;
        }
        debug('Session Invalidated. Attempting to reconnect.');
        debug(packet);
        if (packet.d) {
          this.sendIdentify();
          return;
        }
        this.seq = 0;
        this.sessionId = undefined;
        this.reconnect();
        return;
      case GatewayOpcodes.Reconnect:
        this.reconnect();
        return;
      case GatewayOpcodes.Dispatch:
        if (packet.t === GatewayDispatchEvents.Ready) {
          this.sessionId = packet.d.session_id;
          this.gatewayURL = packet.d.resume_gateway_url ?? this.gatewayURL;
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
