// TODO: This function's types

import { ClientEvents, GatewayIntentBits } from 'discord.js';
import { createFeature, DJSOptions, FeatureData, IntentResolvable } from '../lib/feature';

function getRequiredIntentsForDJSEvent(ev: keyof ClientEvents): IntentResolvable {
  if (ev === 'guildIntegrationsUpdate') return [GatewayIntentBits.GuildIntegrations];
  if (ev === 'webhookUpdate') return [GatewayIntentBits.GuildWebhooks];
  if (ev.startsWith('invite')) return [GatewayIntentBits.GuildInvites];
  if (ev.startsWith('messageReaction')) return [GatewayIntentBits.GuildMessageReactions];
  if (ev.startsWith('typing')) return [GatewayIntentBits.GuildMessageTyping];
  if (ev.startsWith('message')) return [GatewayIntentBits.GuildMessages];
  if (ev.startsWith('guildMember')) return [GatewayIntentBits.GuildMembers];
  if (ev.startsWith('channel')) return [GatewayIntentBits.Guilds];
  if (ev.startsWith('emoji')) return [GatewayIntentBits.GuildEmojisAndStickers];
  if (ev.startsWith('sticker')) return [GatewayIntentBits.GuildEmojisAndStickers];
  if (ev.startsWith('guild')) return [GatewayIntentBits.Guilds];
  return [];
}

/** This hook allows you to listen for a Discord.js client event. Required intents for events are provided. */
export function $onEvent<E extends keyof ClientEvents>(
  eventName: E,
  handler: (...args: ClientEvents[E]) => void
) {
  return createFeature({
    name: `discord.js on("${eventName}") handler`,

    djsClient(client) {
      client.on(eventName, handler);
      return () => client.off(eventName, handler);
    },

    intents: getRequiredIntentsForDJSEvent(eventName),
  });
}

/** This hook allows you to modify the Discord.js configuration. You cannot pass `intents` here, see $intents. */
export function $djsOptions(options: FeatureData['djsOptions'] | DJSOptions) {
  return createFeature({
    name: 'discord.js options',
    djsOptions:
      typeof options === 'function'
        ? options
        : previousOptions => ({ ...previousOptions, ...options }),
  });
}

export function $interaction(handler: FeatureData['interaction']) {
  return createFeature({
    name: 'interaction handler',
    interaction: handler,
  });
}
