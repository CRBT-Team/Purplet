import type { LogFunction } from '@paperdave/logger';
import type { Awaitable } from '@paperdave/utils';
import type { InputOption, InputOptions, InputOptionsWithPlugins } from 'rollup';
import type { ResolvedConfig } from '../config/types';

export interface AdapterData {
  input: InputOption;
  onRollupConfig?(defaultConfig: InputOptionsWithPlugins): Awaitable<InputOptions | void>;
  onBuild(builder: AdapterAPI): Awaitable<void>;
}

export interface AdapterAPI {
  log: LogFunction;
  rimraf(dir: string): void;
  mkdirp(dir: string): void;

  getBuildDir(): string;
  getTempDir(): string;
  getSourceDir(): string;

  writeRollup(distDir: string): Promise<void>;
}

export type Adapter = (config: ResolvedConfig) => Awaitable<AdapterData>;
