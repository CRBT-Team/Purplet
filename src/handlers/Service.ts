import { REST } from '@discordjs/rest';
import { Awaitable, Client } from 'discord.js';
import { Config, createInstance, Handler, HandlerInstance, IPurplet } from '..';

const INSTANCE_REF = Symbol('INSTANCE_REF');

interface ServiceAPI {
  config: Config;
  client: Client;
  rest: REST;
  purplet: IPurplet;
}

export interface ServiceDataInput<T> {
  name: string;
  init(this: Partial<T> & ServiceAPI): Awaitable<void>;
  cleanup(this: T & ServiceAPI): Awaitable<void>;
}

export interface ServiceData<T> extends ServiceDataInput<T> {
  [INSTANCE_REF]: ServiceInstance<T> & ServiceAPI;
}

export type ServiceInstance<T> = HandlerInstance<ServiceData<T>> & Partial<T>;

export class ServiceHandler extends Handler<ServiceData<unknown>> {
  services = new Map<string, ServiceData<unknown>>();
  running = false;

  async init() {
    this.running = true;
    for (const [id, service] of this.services) {
      await service.init.call(service[INSTANCE_REF]);
    }
  }

  async cleanup() {
    this.running = false;
    for (const [id, service] of this.services) {
      await service.cleanup.call(service[INSTANCE_REF]);
    }
  }

  async register(id: string, instance: ServiceData<unknown>) {
    this.services.set(id, instance);
    instance[INSTANCE_REF].client = this.client;
    instance[INSTANCE_REF].rest = this.rest;
    instance[INSTANCE_REF].config = this.config;
    instance[INSTANCE_REF].purplet = this.purplet;
    if (this.running) {
      await instance.init.call(instance[INSTANCE_REF]);
    }
  }

  async unregister(id: string, instance: ServiceData<unknown>) {
    this.services.delete(id);
    if (this.running) {
      await instance.cleanup.call(instance[INSTANCE_REF]);
    }
  }
}

export function Service<T>(data: ServiceDataInput<T>): ServiceInstance<T> {
  const i = createInstance(ServiceHandler, data) as ServiceInstance<T>;
  i.data[INSTANCE_REF] = i as ServiceInstance<T> & ServiceAPI;
  return i;
}
