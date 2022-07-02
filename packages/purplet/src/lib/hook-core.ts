import type {
  GatewayDispatchPayload,
  GatewayIntentBits,
  GatewayPresenceUpdateData,
  RESTPutAPIApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { createHook } from './hook';
import { IntentBitfield, Interaction } from '../structures';

export type InitializeHookEvent = undefined;
export type InteractionHookEvent = Interaction;
export type DispatchHookEvent = GatewayDispatchPayload;
export type ApplicationCommandsHookData = RESTPutAPIApplicationCommandsJSONBody;
export type IntentsHookData =
  | IntentBitfield
  | GatewayIntentBits
  | (IntentBitfield | GatewayIntentBits)[];
export type PresenceHookData = GatewayPresenceUpdateData;

export function mergeIntents(intents: IntentsHookData[]) {
  return intents.map(x => IntentBitfield.resolve(x).bitfield).reduce((a, b) => a | b);
}

export const $initialize = createHook<InitializeHookEvent, 'lifecycle'>({
  id: 'initialize',
  type: 'lifecycle',
  core: true,
});
export const $dispatch = createHook<DispatchHookEvent, 'event'>({
  id: 'dispatch',
  type: 'event',
  core: true,
});
export const $interaction = createHook<InteractionHookEvent, 'event'>({
  id: 'interaction',
  type: 'event',
  core: true,
});
export const $applicationCommands = createHook<ApplicationCommandsHookData, 'data'>({
  id: 'applicationCommands',
  type: 'data',
  core: true,
});
/**
 * This hook allows you to specify what gateway intents your gateway bot requires.
 *
 * Takes either one or more intents (numbers, see `GatewayIntentBits` from `discord-api-types`), one
 * or more arrays of intents, or a function returning that.
 */
export const $intents = createHook<IntentsHookData, 'data'>({
  id: 'intents',
  type: 'data',
  core: true,
});
export const $presence = createHook<PresenceHookData, 'data'>({
  id: 'presence',
  type: 'data',
  core: true,
});

export type LifecycleHookNames = 'initialize';
export type EventHookNames = 'dispatch' | 'interaction';
export type DataHookNames = 'applicationCommands' | 'intents' | 'presence';
export type CoreHookNames = LifecycleHookNames | EventHookNames | DataHookNames;
