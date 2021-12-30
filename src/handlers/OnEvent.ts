import { ClientEvents, Intents } from 'discord.js';
import { createInstance } from '..';
import { Handler } from '../Handler';

export interface OnEventData<K extends keyof ClientEvents = keyof ClientEvents> {
  event: K;
  listener: (...args: ClientEvents[K]) => void;
}

export class OnEventHandler extends Handler<OnEventData> {
  events = new Map<string, OnEventData>();

  register(id: string, instance: OnEventData) {
    if (this.events.has(id)) {
      this.unregister(id);
    }
    this.events.set(id, instance);
    if (instance.event.startsWith('message')) {
      if (!new Intents(this.client.options.intents).has('GUILD_MESSAGES')) {
        console.warn(
          `NOTICE: Your bot is missing the GUILD_MESSAGES intent. OnEvent("${instance.event}") will not recieve events.`
        );
      }
    }
    this.client.on(instance.event, instance.listener);
  }

  unregister(id: string) {
    const data = this.events.get(id);
    if (data) {
      this.client.off(data.event, data.listener);
      this.events.delete(id);
    }
  }
}

export function OnEvent<K extends keyof ClientEvents>(
  event: K,
  listener: (...args: ClientEvents[K]) => void
) {
  return createInstance(OnEventHandler, {
    event,
    listener,
  } as OnEventData);
}
