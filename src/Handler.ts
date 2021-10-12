import { Client } from "discord.js";
import { Config } from "./Config";

const CONTROLLER = Symbol("CONTROLLER");
const HANDLER_IMPL = Symbol("HANDLER_IMPL");

export interface HandlerInstance<T> {
  [CONTROLLER]: Handler<T>;
  data: T;
}

export interface Handler<T> {
  [HANDLER_IMPL]: HandlerImplementation<T>;
  createInstance(data: T): HandlerInstance<T>;
}

export interface HandlerThis {
  client: Client;
  config: Config;
}

export interface HandlerImplementation<T> {
  init?: (this: HandlerThis) => void;
  destroy?: (this: HandlerThis) => void;
  register?: (this: HandlerThis, id: string, instance: T) => void | Promise<void>;
  unregister?: (this: HandlerThis, id: string, instance: T) => void | Promise<void>;
  update?: (this: HandlerThis, id: string, instance: T) => void | Promise<void>;
}

export function createHandler<T>(data: HandlerImplementation<T>): Handler<T> {
  return {
    [HANDLER_IMPL]: data,
    createInstance(data: T) {
      return {
        [CONTROLLER]: this,
        data,
      };
    },
  };
}
