import EventEmitter from 'events';
import {
  GatewayDispatchEvents,
  GatewayIdentifyData,
  GatewayOpcodes,
  GatewayPresenceUpdateData,
} from 'discord-api-types/v10';
import { Client } from 'discord.js';

/**
 * GatewayClient is a Discord Gateway Client implementation. for now it is literally a wrapper
 * around discord.js.
 *
 * Specs:
 *
 * - Pass an GatewayIdentifyData, immediately connects.
 * - Emits gateway events by name.
 * - Emits '*' event to catch all.
 * - UpdatePresence() to update presence.
 */
export class GatewayClient extends EventEmitter {
  private client: Client;

  constructor(
    private identify: Pick<GatewayIdentifyData, 'token' | 'shard' | 'presence' | 'intents'>
  ) {
    super();
    this.client = new Client({
      intents: this.identify.intents,
      // TODO: Implement presence and shard
    });
    this.client.login(this.identify.token);

    const wsEmit = this.client.ws.emit;
    this.client.ws.emit = (event: GatewayDispatchEvents, data: unknown) => {
      this.emit(event, data);
      this.emit('*', {
        op: GatewayOpcodes.Dispatch,
        t: event,
        d: data,
      });
      return wsEmit.call(this.client!.ws, event, data);
    };
  }

  close() {
    this.client.destroy();
  }

  updatePresence(presence: GatewayPresenceUpdateData) {
    // TODO: Implement
  }
}
