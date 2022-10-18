import type {
  GatewayActivityUpdateData,
  GatewayDispatchPayload,
  GatewayIntentBits,
  RESTPutAPIApplicationCommandsJSONBody,
} from 'purplet/types';
import { createCoreHook } from './hook';
import type { ApplicationCommandResolvable } from './hook-core-merge';
import type { BitfieldResolvable, Interaction } from '../structures';

export type InitializeHookEvent = undefined;
export type InteractionHookEvent = Interaction;
export type DispatchHookEvent = GatewayDispatchPayload;
export type ApplicationCommandsHookData = RESTPutAPIApplicationCommandsJSONBody;
export type IntentsHookData = BitfieldResolvable<typeof GatewayIntentBits>;

export interface PresenceHookData {
  since?: number | null;
  activities?: GatewayActivityUpdateData[];
  status?: PresenceStatus;
  afk?: boolean;
}

export enum PresenceStatus {
  Online = 'online',
  DoNotDisturb = 'dnd',
  Idle = 'idle',
  /** Invisible is shown as offline. */
  Invisible = 'invisible',
}

export const $initialize = /*#__PURE__*/ createCoreHook<InitializeHookEvent, 'lifecycle'>({
  id: 'initialize',
  type: 'lifecycle',
});
export const $dispatch = /*#__PURE__*/ createCoreHook<DispatchHookEvent, 'event'>({
  id: 'dispatch',
  type: 'event',
});
export const $interaction = /*#__PURE__*/ createCoreHook<InteractionHookEvent, 'event'>({
  id: 'interaction',
  type: 'event',
});
export const $applicationCommands = /*#__PURE__*/ createCoreHook<
  ApplicationCommandResolvable,
  'data'
>({
  id: 'applicationCommands',
  type: 'data',
});
/**
 * This hook allows you to specify what gateway intents your gateway bot requires.
 *
 * Takes either one or more intents (numbers, see `GatewayIntentBits` from `discord-api-types`), one
 * or more arrays of intents, or a function returning that.
 */
export const $intents = /*#__PURE__*/ createCoreHook<IntentsHookData, 'data'>({
  id: 'intents',
  type: 'data',
});
export const $presence = /*#__PURE__*/ createCoreHook<PresenceHookData, 'data'>({
  id: 'presence',
  type: 'data',
});

export type LifecycleHookNames = 'initialize';
export type EventHookNames = 'dispatch' | 'interaction';
export type DataHookNames = 'applicationCommands' | 'intents' | 'presence';
export type CoreHookNames = LifecycleHookNames | EventHookNames | DataHookNames;
