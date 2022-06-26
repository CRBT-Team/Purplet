// TODO: This function's types

import { ClientEvents, GatewayIntentBits } from 'discord.js';
import { createFeature, FeatureData, IntentResolvable } from '../lib/feature';

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
// export function $onEvent<E extends keyof ClientEvents>(
//   eventName: E,
//   handler: (...args: ClientEvents[E]) => void
// ) {
//   return createFeature({
//     djsClient(client) {
//       client.on(eventName, handler);
//       return () => client.off(eventName, handler);
//     },

//     intents: getRequiredIntentsForDJSEvent(eventName),
//   });
// }

export function $interaction(handler: FeatureData['interaction']) {
  return createFeature({
    interaction: handler,
  });
}
