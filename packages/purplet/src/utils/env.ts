// @ts-expect-error idk, even with installing types this broke.
import structuredClone from '@ungap/structured-clone';
import { config } from 'dotenv';

export function setupEnv() {
  config();

  global.structuredClone ??= structuredClone;
}
