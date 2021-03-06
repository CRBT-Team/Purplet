// `purplet` public api entry point:

import '@purplet/polyfill';

export const version = '__VERSION__';

export * from './builders';
export type { Config } from './config/types';
export * from './hooks';
export { rest } from './lib/global';
export * from './lib/hook-core';
export * from './lib/hook-merge';
export * from './structures';
export type { Cleanup } from './utils/types';
