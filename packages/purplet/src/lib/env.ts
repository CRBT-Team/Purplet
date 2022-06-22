// @ts-expect-error idk, even with installing types this broke.
import structuredClone from '@ungap/structured-clone';
import { watch } from 'chokidar';
import { config } from 'dotenv';
import path from 'path';

const envFile = path.resolve(process.cwd(), '.env');

const listeners = new Set<(env: any) => void>();

export function setupEnv(isDev: boolean) {
  config({ path: envFile });
  global.structuredClone ??= structuredClone;

  if (isDev) {
    watch(envFile).on('change', () => {
      config({ path: envFile });
      listeners.forEach((listener) => listener(process.env));
    })
  }
}

export function getEnvVar(name: string): string | null {
  return process.env[name] ?? null;
}

export function onEnvChange(listener: (env: any) => void) {
  listeners.add(listener);
}
