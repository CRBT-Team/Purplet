import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import chalk from 'chalk';
import path from 'path';
import esbuild from 'rollup-plugin-esbuild';
import { Logger, Spinner } from '@paperdave/logger';
import type { OutputOptions } from 'rollup';
import { gateway } from './adapters/gateway';
import { buildPhase1 } from './phase1';
import { buildPhase2 } from './phase2';
import { buildPhase3 } from './phase3';
import type { ResolvedConfig } from '../config/types';

export async function buildPurpletBot(config: ResolvedConfig, spinner?: Spinner) {
  const debug = new Logger('build', { debug: true });

  config.adapter ??= gateway;

  debug('initializing adapter');
  const adapter = await config.adapter(config);
  adapter.name ??= config.adapter.name;

  if (spinner) {
    spinner.text += ` with the ${chalk.bold(adapter.name)} adapter`;
  }

  // Setup common rollup stuff
  const aliasEntries: Record<string, string> = {};
  for (const [key, value] of Object.entries(config.alias)) {
    aliasEntries[key] = path.resolve(value);
  }

  const sharedRollupPlugins = [
    resolve({
      extensions: ['.mjs', '.js', '.ts', '.json'],
      browser: true,
    }),
    esbuild({
      target: 'esnext',
      platform: 'neutral',
    }),
    alias({
      entries: aliasEntries,
    }),
  ];

  // Phase 1 is building a map of the bot features.
  debug('starting phase 1');
  const featureScan = await buildPhase1({ config, sharedRollupPlugins });

  debug('starting phase 2');
  const { roll, rollupConfig } = await buildPhase2({
    config,
    adapter,
    sharedRollupPlugins,
    featureScan,
  });

  debug('starting phase 3');
  const mainOutput = await buildPhase3({
    config,
    roll,
    outputConfig: rollupConfig.output as OutputOptions,
    adapter,
  });

  return {
    mainOutput,
  };
}
