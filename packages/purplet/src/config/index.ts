import { mkdir, readdir, readFile } from 'fs/promises';
import { exists } from '../utils/fs';
import { resolveConfig } from './resolver';
import type { Config } from './types';
import { setValidatorBasePath } from './validators';

const searchPaths = [
  // 'purplet.config.ts',
  'purplet.config.js',
];

export async function loadConfig(projectRoot: string) {
  const files = await readdir(projectRoot);
  const matched = searchPaths.filter(file => files.includes(file));

  if (matched.length === 0) {
    throw new Error(
      `No configuration file found in your project. See https://purplet.js.org/docs/configuration`
    );
  }

  if (matched.length > 1) {
    throw new Error(
      `Multiple configuration files found in ${projectRoot}. Please remove one of them:\n`
      + matched.map(file => `  - ${file}`).join('\n')
    );
  }

  let config: Config;

  if (matched[0].endsWith('.ts')) {
    throw new Error(`Purplet does not support TypeScript configuration files yet.`);
  } else {
    config = (await import(`file:///${projectRoot}/${matched[0]}`)).default;
  }

  setValidatorBasePath(projectRoot);
  const resolved = resolveConfig(config);

  if (!await exists(resolved.paths.temp)) {
    await mkdir(resolved.paths.temp);
  }

  return resolved;
}