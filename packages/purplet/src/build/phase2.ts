import commonjs from '@rollup/plugin-commonjs';
import { Logger } from '@paperdave/logger';
import { Plugin, rollup, RollupError, VERSION as ROLLUP_VERSION } from 'rollup';
import entrypoint from './builtin-entrypoint.ts';
import type { AdapterData, PurpletRollupOptions } from './adapter';
import { pluginAdapterAPI } from './rollup-plugin-purplet-adapter-api';
import { pluginConfig } from './rollup-plugin-purplet-config';
import { pluginEntrypoints } from './rollup-plugin-purplet-entry';
import { pluginFeatures } from './rollup-plugin-purplet-features';
import type { ResolvedConfig } from '../config/types';
import type { FeatureScan } from '../utils/build-phase-1';
import { purpletSourceCode } from '../utils/fs';

const builtInEntrypoint = `${purpletSourceCode}/${entrypoint}`;

export interface Phase2Options {
  config: ResolvedConfig;
  sharedRollupPlugins: Plugin[];
  adapter: AdapterData;
  featureScan: FeatureScan;
}

/** Phase 2 is building the rollup build. */
export async function buildPhase2({
  config,
  adapter,
  sharedRollupPlugins,
  featureScan,
}: Phase2Options) {
  const log = new Logger('build:phase2', { debug: true });

  const adapterEntry = adapter.input;

  log('using entrypoint: %s', adapterEntry);

  let rollupConfig: PurpletRollupOptions = {
    input: '$$entrypoint',
    plugins: [
      pluginEntrypoints([builtInEntrypoint, adapterEntry]),
      pluginConfig(config),
      pluginFeatures({ config, featureScan }),
      pluginAdapterAPI(),
      ...sharedRollupPlugins,
      commonjs(),
    ],
    output: {
      format: 'esm',
      sourcemap: true,
      banner: [
        `// Built by Purplet v__VERSION__ and Rollup ${ROLLUP_VERSION}`,
        `// Adapter: ${adapter.name}${adapter.version ? ` v${adapter.version}` : ''}`,
      ].join('\n'),
    },
  };

  rollupConfig =
    ((await adapter.rollupConfig?.(rollupConfig)) as PurpletRollupOptions) ?? rollupConfig;

  if (process.env.DEBUG_ROLLUP_CONFIG) {
    log('merged rollup config:');
    const printRollupConfig = {
      ...rollupConfig,
      plugins: rollupConfig.plugins.map(p => p.name),
    };
    log(printRollupConfig);
  } else {
    log('set $DEBUG_ROLLUP_CONFIG to print the merged rollup config');
  }

  let warnings = false;

  rollupConfig.onwarn = warning => {
    Logger.warn(warning.message);
  };

  try {
    const roll = await rollup(rollupConfig);

    if (warnings) {
      Logger.warn('Rollup completed with warnings. Build may not function when run.');
    }

    return { roll, rollupConfig };
  } catch (e: any) {
    const error = e as RollupError;
    Logger.error('Rollup failed to build.');
    Logger.error(error.cause);
    Logger.error((error.plugin ?? 'Unknown plugin') + ' at ' + error.hook);
    Logger.error(error.loc);
    Logger.error(error.id);
    throw new Error(e);
  }
}
