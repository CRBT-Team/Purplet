// `purplet` public api entry point:

export * from './builders';
export type { Config } from './config/types';
export * from './hooks';
export * from './lib/hook-core';
export { rest } from './lib/global';
export * from './structures';
export type { Cleanup } from './utils/types';

export const version = 'VERSION';
