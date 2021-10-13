import { REST } from "@discordjs/rest";
import { Client } from "discord.js";
import { Config, Framework } from ".";
import { Class } from "./util/types";

const IS_HANDLER_INSTANCE = Symbol("IS_HANDLER_INSTANCE");

export interface HandlerInstance<T> {
  [IS_HANDLER_INSTANCE]: true;
  handlerClass: Class<Handler<T>>;
  data: T;
}

export abstract class Handler<T = any> {
  config!: Config;
  client!: Client;
  rest!: REST;
  framework!: Framework;

  /**
   * Called before modules are registered and the bot is logged on, but the rest client is available. Call `this.client.on` in this event, or else you may not receive any events.
   */
  abstract preInit(): void;
  /**
   * Called after the bot has logged on, use this to run startup tasks that require the discord api.
   */
  abstract init(): Promise<void> | void;
  /** Called when the bot is shutting down. */
  abstract destroy(): void;
  /** Called when a new handler instance is passed. `id` is a unique string identifying itself. */
  abstract register(id: string, instance: T): void | Promise<void>;
  /** Called when a new handler instance is removed. `id` is a unique string identifying itself. */
  abstract unregister(id: string, instance: T): void | Promise<void>;
  /** Dev Mode: Called when a module has been updated, and it should be initialized. */
  abstract hmrReload(id: string, instance: T): void | Promise<void>;
  /** Dev Mode: Called when a module has been completely removed, and it should be destroyed. */
  abstract hmrDestroy(id: string, instance: T): void | Promise<void>;
}

export function createInstance<T>(handlerClass: Class<Handler<T>>, data: T): HandlerInstance<T> {
  return {
    [IS_HANDLER_INSTANCE]: true,
    data,
    handlerClass,
  };
}

export function isHandlerInstance(x: any): x is HandlerInstance<unknown> {
  return x && typeof x === "object" && IS_HANDLER_INSTANCE in x;
}
