// `purplet` public api entry point:

export const version = '__VERSION__';

export * from '@purplet/utils';
export * from './lib/OptionBuilder';
export type { Config } from './config/types';
export * from './hooks';
export * from './lib/hook-core';
export * from './lib/hook-merge';
export type { Cleanup } from './utils/types';
