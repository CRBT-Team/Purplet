// @ts-expect-error idk, even with installing types this broke.
import structuredClone from '@ungap/structured-clone';
import { watch } from 'chokidar';
import { config } from 'dotenv';
import path from 'path';

const envFile = path.resolve(process.cwd(), '.env');

export function setupEnv(isDev: boolean) {
  config({ path: envFile });
  global.structuredClone ??= structuredClone;
}

export function getEnvVar(name: string): string | null {
  return process.env[name] ?? null;
}
