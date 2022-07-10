// @ts-expect-error idk, even with installing types this broke.
import structuredClone from '@ungap/structured-clone';
import fetch, { Request, Response } from 'node-fetch';
import path from 'path';
import { config } from 'dotenv';
import { WebSocket } from 'ws';

const envFile = path.resolve(process.cwd(), '.env');

export function setupEnv(isDev: boolean) {
  config({ path: envFile });
  global.structuredClone ??= structuredClone;
  (global as any).fetch ??= fetch;
  (global as any).Request ??= Request;
  (global as any).Response ??= Response;
  (global as any).WebSocket ??= WebSocket;
}

export function getEnvVar(name: string): string | null {
  return process.env[name] ?? null;
}
