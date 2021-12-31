import { REST } from '@discordjs/rest';
import { ApplicationCommandData, Client, IntentsString } from 'discord.js';
import { Config } from './Config';
import { Purplet } from './Purplet';
import { Resolvable } from './util/resolvable';
import { Class } from './util/types';

const IS_HANDLER_INSTANCE = Symbol('IS_HANDLER_INSTANCE');

export type PurpletApplicationCommandData = ApplicationCommandData & {
  /**
   * Filter this command so it only enters certain guilds. Accepts a string[] or a function that
   * resolves to a string[].
   */
  guild?: Resolvable<string | string[]>;
};

export interface HandlerInstance<T> {
  [IS_HANDLER_INSTANCE]: true;
  handlerClass: Class<Handler<T>>;
  data: T;
}

export abstract class Handler<T = unknown> {
  /** Reference to the Purplet configuration */
  config!: Config;
  /** Reference to the Discord.js client. */
  client!: Client;
  /** Reference to the Discord.js rest client. */
  rest!: REST;
  /** Reference to the Purplet class. */
  purplet!: Purplet;

  /** Set up your handler */
  init(): Promise<void> | void {}
  /** Clean up your handler. */
  cleanup(): void {}

  /** Called when a new handler instance is passed. `id` is a unique string identifying itself. */
  register(id: string, instance: T): void | Promise<void> {}
  /** Called when a new handler instance is removed. `id` is a unique string identifying itself. */
  unregister(id: string, instance: T): void | Promise<void> {}

  /**
   * Purplet handles registering application commands by having handlers define and return them
   * here. This function is called after registration.
   */
  getApplicationCommands(): ApplicationCommandData[] {
    return [];
  }

  /**
   * If your handler requires certain intents, return them here. This is ran BEFORE registration, so
   * it cannot depend or change once the bot is started.
   */
  getIntents(): IntentsString[] {
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
  return !!x && (x as HandlerInstance<unknown>)[IS_HANDLER_INSTANCE] === true;
}

export function getPurplet() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const purplet = (global as any).purplet as Purplet;
  if (!purplet) {
    return undefined;
  }
  return purplet;
}

export function getHandlerSingleton<X extends Handler>(cls: Class<X>): X | undefined {
  const purplet = getPurplet();
  if (!purplet) {
    return undefined;
  }
  return purplet.handlers.find((x) => x.constructor === cls) as X;
}

export function getDiscordClient() {
  const purplet = getPurplet();
  if (!purplet) {
    return undefined;
  }
  return purplet.client;
}

export function getRestClient() {
  const purplet = getPurplet();
  if (!purplet) {
    return undefined;
  }
  return purplet.rest;
}
