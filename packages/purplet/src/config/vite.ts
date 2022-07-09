import path from 'path';
import { unique } from '@davecode/utils';
import type { InlineConfig as ViteConfig } from 'vite';
import type { ResolvedConfig } from './types';
import { purpletSourceCode } from '../utils/fs';

export async function createViteConfig(config: ResolvedConfig, mode: 'development' | 'production') {
  const userViteConfig = await (typeof config.vite === 'function' ? config.vite() : config.vite);

  const alias: Record<string, string> = {};

  // This setup for aliases might not get every edge case that writeTSConfig handles
  for (const [key, value] of Object.entries(config.alias)) {
    alias[key] = path.resolve(value);
  }

  const vite: ViteConfig = {
    ...userViteConfig,
    configFile: false,
    envFile: false,
    mode,
    root: config.root,
    logLevel: 'silent',
    plugins: [...(userViteConfig.plugins ?? [])],
    server: {
      ...userViteConfig.server,
      watch: {
        ...userViteConfig.server?.watch,
        ignored: purpletSourceCode,
      },
    },
    ssr: {
      ...userViteConfig.ssr,
      external: unique([...(userViteConfig.ssr?.external ?? []), 'purplet', 'discord-api-types']),
      format: 'esm',
    },
    resolve: {
      ...userViteConfig.resolve,
      alias,
    },
  };

  return vite;
}
