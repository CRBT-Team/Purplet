import { REST } from '@discordjs/rest';
import { ApplicationCommandData, Client } from 'discord.js';
import { Config, Purplet } from '.';
import { Class } from './util/types';

const IS_HANDLER_INSTANCE = Symbol('IS_HANDLER_INSTANCE');

export interface HandlerInstance<T> {
  [IS_HANDLER_INSTANCE]: true;
  handlerClass: Class<Handler<T>>;
  data: T;
}

export abstract class Handler<T = unknown> {
  config!: Config;
  client!: Client;
  rest!: REST;
  framework!: Purplet;

  /**
   * Called before modules are registered and the bot is logged on, but the rest client is
   * available. Call `this.client.on` in this event, or else you may not receive any events.
   */
  setup(): void {}
  /** Called after the bot has logged on, use this to run startup tasks that require the discord api. */
  init(): Promise<void> | void {}
  /** Called when the bot is shutting down. */
  cleanup(): void {}
  /** Called when a new handler instance is passed. `id` is a unique string identifying itself. */
  register(id: string, instance: T): void | Promise<void> {}
  /** Called when a new handler instance is removed. `id` is a unique string identifying itself. */
  unregister(id: string, instance: T): void | Promise<void> {}

  getApplicationCommands(): ApplicationCommandData[] {
    return [];
  }
}

export function createInstance<T>(handlerClass: Class<Handler<T>>, data: T): HandlerInstance<T> {
  return {
    [IS_HANDLER_INSTANCE]: true,
    data,
    handlerClass,
  };
}

export function isHandlerInstance(x: unknown): x is HandlerInstance<unknown> {
  return typeof x === 'object' && x !== null && IS_HANDLER_INSTANCE in x;
}
