import { readdir } from 'fs/promises';
import { resolveConfig } from './resolver';
import type { Config } from './types';
import { setValidatorBasePath } from './validators';
import { log } from '../lib/logger';
import { mkdirp } from '../utils/fs';

const searchPaths = [
  // 'purplet.config.ts',
  'purplet.config.js',
];

export async function loadConfig(root: string) {
  const files = await readdir(root);
  const matched = searchPaths.filter(file => files.includes(file));

  if (matched.length === 0) {
    throw new Error(
      `No configuration file found in your project. See https://purplet.js.org/docs/configuration`
    );
  }

  if (matched.length > 1) {
    throw new Error(
      `Multiple configuration files found in ${root}. Please remove one of them:\n` +
        matched.map(file => `  - ${file}`).join('\n')
    );
  }

  let config: Config;

  if (matched[0].endsWith('.ts')) {
    throw new Error(`Purplet does not support TypeScript configuration files yet.`);
  } else {
    config = (await import(`file:///${root}/${matched[0]}`)).default;
  }

  try {
    setValidatorBasePath(root);
    const resolved = resolveConfig(root, config);

    await mkdirp(resolved.paths.temp);

    return resolved;
  } catch (error) {
    if (error instanceof Error) {
      log('error', 'Error while loading configuration:\n  ' + error.message.replace(/\n/g, '\n  '));
    } else {
      log('error', 'Error while loading configuration: ' + error);
    }
    throw new Error('');
  }
}
