import type { LogFunction } from '@paperdave/logger';
import type { Awaitable } from '@paperdave/utils';
import type { InputOptions, InputOptionsWithPlugins, OutputOptions } from 'rollup';
import type { ResolvedConfig } from '../config/types';

export interface PurpletRollupOptions extends InputOptionsWithPlugins {
  // This is included for compatibility with config files but ignored by rollup.rollup
  output?: OutputOptions | OutputOptions[];
}

export interface AdapterData {
  name: string;
  version?: string;
  input: string;
  rollupConfig?(defaultConfig: PurpletRollupOptions): Awaitable<InputOptions | void>;
  adapt(builder: BuildAPI): Awaitable<void>;
}

export interface BuildAPI {
  log: LogFunction;
  debug: LogFunction;

  rimraf(dir: string): void;
  mkdirp(dir: string): void;

  getBuildDir(): string;
  getTempDir(): string;
  getSourceDir(): string;

  writeRollup(distDir?: string): Promise<void>;
}

export type Adapter = (config: ResolvedConfig) => Awaitable<AdapterData>;
