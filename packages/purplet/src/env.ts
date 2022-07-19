import type { Gateway } from '@purplet/gateway';
import type { Rest } from '@purplet/rest';
import type { User } from './structures';

export let rest: Rest;
export let gateway: Gateway;
export let botUser: User;
// TODO: properly type env
export let env: any = process.env;

interface GlobalEnv {
  rest: Rest;
  gateway: Gateway;
  botUser: User;
  env?: any;
}

/** @internal */
export function setGlobalEnv(newEnv: GlobalEnv): void {
  rest = newEnv.rest;
  gateway = newEnv.gateway;
  botUser = newEnv.botUser;
  if (newEnv.env) {
    env = newEnv.env;
  }
}
