import { GatewayDispatchEvents, GatewayIntentBits } from 'discord.js';
import {
  createFeature,
  FeatureData,
  GatewayEventHook,
  IntentResolvable,
  MarkedFeature,
} from '../lib/feature';

function getIntents(ev: GatewayDispatchEvents): IntentResolvable {
  if (ev === GatewayDispatchEvents.GuildIntegrationsUpdate)
    return [GatewayIntentBits.GuildIntegrations];
  if (ev === GatewayDispatchEvents.WebhooksUpdate) return [GatewayIntentBits.GuildWebhooks];
  if (ev.startsWith('INVITE_')) return [GatewayIntentBits.GuildInvites];
  if (ev.startsWith('MESSAGE_REACTION_')) return [GatewayIntentBits.GuildMessageReactions];
  if (ev === GatewayDispatchEvents.TypingStart) return [GatewayIntentBits.GuildMessageTyping];
  if (
    [
      GatewayDispatchEvents.MessageCreate,
      GatewayDispatchEvents.MessageDelete,
      GatewayDispatchEvents.MessageDeleteBulk,
    ].includes(ev)
  )
    return [GatewayIntentBits.GuildMessages];
  if (ev.startsWith('GUILD_MEMBER')) return [GatewayIntentBits.GuildMembers];
  if (ev.startsWith('CHANNEL_')) return [GatewayIntentBits.Guilds];
  if (ev === GatewayDispatchEvents.GuildEmojisUpdate)
    return [GatewayIntentBits.GuildEmojisAndStickers];
  if (ev === GatewayDispatchEvents.GuildStickersUpdate)
    return [GatewayIntentBits.GuildEmojisAndStickers];
  if (ev.startsWith('GUILD_')) return [GatewayIntentBits.Guilds];
  return [];
}

/**
 * This hook allows you to specify what gateway intents your gateway bot requires. Does not assume a
 * Discord.js environment, and will trigger on either using Discord.js, or the `gatewayEvents` hook.
 *
 * Takes either one or more intents (numbers, see `GatewayIntentBits` from `discord-api-types`), one
 * or more arrays of intents, or a function returning that.
 */
export function $intents(...intents: IntentResolvable[]): MarkedFeature;
export function $intents(intents: FeatureData['intents']): MarkedFeature;
export function $intents(first: FeatureData['intents'], ...rest: IntentResolvable[]) {
  return createFeature({
    intents: typeof first === 'function' ? first : rest.flat(),
  });
}

export function $onEvent<K extends keyof GatewayEventHook>(
  eventName: K,
  handler: (data: GatewayEventHook[K]) => void
) {
  return createFeature({
    gatewayEvent: {
      [eventName]: handler,
    },
    intents: getIntents(eventName as GatewayDispatchEvents),
  });
}

// /**
//  * This hook allows you to pass in presence data. It is run only once at startup.
//  *
//  * This is a wrapper around `$djsOptions` and passing a `presence` object.
//  */
// export function $presence(presence: PresenceData) {
//   return $djsOptions({ presence });
// }
