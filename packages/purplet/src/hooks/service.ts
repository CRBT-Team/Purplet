import { Logger } from '@paperdave/logger';
import type { Awaitable } from '@paperdave/utils';
import { $initialize } from '../lib/hook-core';
import type { Cleanup } from '../utils/types';

export interface ServiceOptions {
  name?: string;
  start(): Awaitable<Cleanup>;
  stop?(): void;
}

/**
 * A service is a way to run some code alongside your bot in a hot-reloadable way. The function
 * called starts the service, and returns a stopping function. Alternatively, you can pass both a
 * start and stop function if that is easier.
 */
export function $service<Pass>({ name, start, stop }: ServiceOptions, passthrough: Pass) {
  return $initialize(async function () {
    Logger.debug(`starting service "${name ?? `<${this.featureId}>`}"`);
    const cleanup = await start();

    return () => {
      Logger.debug(`stopping service "${name ?? `<${this.featureId}>`}"`);

      cleanup?.();
      stop?.();
    };
  }, passthrough);
}
