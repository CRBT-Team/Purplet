import type { Gateway } from '@purplet/gateway';
import type { Rest } from '@purplet/rest';
import type { RuntimeConfig } from '../config/types';
import type { ApplicationFlagsBitfield, User } from '../structures';

export interface GlobalEnv {
  application: { id: string; flags: ApplicationFlagsBitfield };
  botUser: User;
  env: any;
  gateway: Gateway;
  rest: Rest;
  config: RuntimeConfig;
}

const globalEnv = {
  env: typeof process !== 'undefined' ? process.env : {},
} as GlobalEnv;

export let application = globalEnv.application;
export let botUser = globalEnv.botUser;
export let config = globalEnv.config; // set internally
export let env = globalEnv.env; // set internally
export let gateway = globalEnv.gateway;
export let rest = globalEnv.rest;

/** @internal */
export function setGlobalEnv(newEnv: Partial<GlobalEnv>): void {
  Object.assign(globalEnv, newEnv);

  application = globalEnv.application;
  botUser = globalEnv.botUser;
  config = globalEnv.config;
  env = globalEnv.env;
  gateway = globalEnv.gateway;
  rest = globalEnv.rest;
}
