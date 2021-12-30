import { ClientEvents, Intents, IntentsString } from 'discord.js';
import { createInstance } from '..';
import { Handler } from '../Handler';

export interface OnEventData<K extends keyof ClientEvents = keyof ClientEvents> {
  event: K;
  listener: (...args: ClientEvents[K]) => void;
}

function getRequiredIntents(ev: keyof ClientEvents): IntentsString[] {
  if (ev === 'guildIntegrationsUpdate') return ['GUILD_INTEGRATIONS'];
  if (ev === 'webhookUpdate') return ['GUILD_WEBHOOKS'];
  if (ev.startsWith('invite')) return ['GUILD_INVITES'];
  if (ev.startsWith('messageReaction')) return ['GUILD_MESSAGE_REACTIONS'];
  if (ev.startsWith('typing')) return ['GUILD_MESSAGE_TYPING'];
  if (ev.startsWith('message')) return ['GUILD_MESSAGES'];
  if (ev.startsWith('guildMember')) return ['GUILD_MEMBERS'];
  if (ev.startsWith('channel')) return ['GUILDS'];
  if (ev.startsWith('emoji')) return ['GUILD_EMOJIS_AND_STICKERS'];
  if (ev.startsWith('sticker')) return ['GUILD_EMOJIS_AND_STICKERS'];
  if (ev.startsWith('guild')) return ['GUILDS'];
  return [];
}

export class OnEventHandler extends Handler<OnEventData> {
  events = new Map<string, OnEventData>();

  register(id: string, instance: OnEventData) {
    if (this.events.has(id)) {
      this.unregister(id);
    }
    this.events.set(id, instance);
    this.client.on(instance.event, instance.listener);

    // sanity checks
    const intents = new Intents(this.client.options.intents);
    const required = getRequiredIntents(instance.event);
    for (const intent of required) {
      if (!intents.has(intent)) {
        console.warn(
          `NOTICE: Your bot is missing the GUILD_MESSAGES intent. OnEvent("${instance.event}") will not recieve events.`
        );
      }
    }
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
