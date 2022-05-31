import { createFeature } from '../feature';
import type { Cleanup } from '../../utils/types';

export interface ServiceOptions {
  name?: string;
  start(): Cleanup;
  stop?(): void;
}
/**
 * A service is a way to run some code alongside your bot in a hot-reloadable way. The function
 * called starts the service, and returns a stopping function. Alternatively, you can pass both a
 * start and stop function if that is easier.
 */
export function $service({ name, start, stop }: ServiceOptions) {
  return createFeature({
    name: name || 'unnamed service',
    async initialize() {
      const cleanup = await start();

      return () => {
        cleanup?.();
        stop?.();
      };
    },
  });
}
