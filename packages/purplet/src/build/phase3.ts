import path from 'path';
import { Logger } from '@paperdave/logger';
import { mkdir, rm } from 'fs/promises';
import type { OutputOptions, RollupBuild } from 'rollup';
import type { Adapter, AdaptEvent } from './adapter';
import type { ResolvedConfig } from '../config/types';

export interface Phase3Options {
  config: ResolvedConfig;
  roll: RollupBuild;
  outputConfig: OutputOptions;
  adapter: Adapter;
}

/** Phase 3 is calling the adapter to write the output. */
export async function buildPhase3({ config, roll, outputConfig, adapter }: Phase3Options) {
  const log = new Logger('build:phase3', { debug: true });

  let jsFileLocation: string | undefined;

  const buildApi: AdaptEvent = {
    log: new Logger('adapter:' + adapter.name, { color: 'cyanBright' }),
    debug: new Logger('adapter:' + adapter.name, { debug: true, color: 'cyan' }),

    mkdirp: filepath => mkdir(filepath, { recursive: true }),
    rimraf: filepath => rm(filepath, { recursive: true, force: true }),

    getBuildDir: () => config.paths.build,
    getSourceDir: () => path.join(config.root, 'src'),
    getTempDir: () => config.temp,

    async writeRollup(file = path.join(config.paths.build, 'index.js')) {
      log('writing rollup output to %s', path.relative(process.cwd(), file));
      const output = await roll.write({
        ...outputConfig,
        file,
      });
      jsFileLocation = file;
      log('wrote rollup output');
    },
  };

  log('calling adapter');
  await adapter.adapt(buildApi);

  if (!jsFileLocation) {
    Logger.warn('Adapter did not call writeRollup. Build may not actually exist.');
  }

  return jsFileLocation ?? config.paths.build;
}
