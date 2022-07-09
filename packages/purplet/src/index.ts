// `purplet` public api entry point:

export const version = '__VERSION__';

export * from './builders';
export type { Config } from './config/types';
export * from './hooks';
export * from './lib/hook-core';
export * from './lib/hook-merge';
export { rest } from './lib/global';
export * from './structures';
export type { Cleanup } from './utils/types';
