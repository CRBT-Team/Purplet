// Purplet internal APIs
// While you *can* use stuff defined here, changes here may not follow semver.

export * from './lib/env';
export * from './lib/GatewayBot';
export * from './lib/hook-merge';
export * from './utils/arraybuffer';
export * from './utils/build-phase-1';
export * from './utils/feature';
export * from './utils/is-directly-run';
export * from './cli/errors';
export * from '@paperdave/logger';

export async function importPolyfill() {
  // @ts-expect-error - this module exports nothing, creating a type error here.
  await import('@purplet/polyfill');
}
