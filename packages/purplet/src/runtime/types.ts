import type { LogFunction } from '@paperdave/logger';
import type { Awaitable } from '@paperdave/utils';
import type { InputOption, InputOptions, InputOptionsWithPlugins } from 'rollup';
import type { ResolvedConfig } from '../config/types';

export interface RuntimeData {
  input: InputOption;
  rollupConfig?(defaultConfig: InputOptionsWithPlugins): Awaitable<InputOptions | void>;
  writeBundle(builder: RuntimeBuildAPI): Awaitable<void>;
}

export interface RuntimeBuildAPI {
  log: LogFunction;
  rimraf(dir: string): void;
  mkdirp(dir: string): void;

  getBuildDir(): string;
  getTempDir(): string;
  getSourceDir(): string;

  writeRollup(distDir: string): Promise<void>;
}

export type Runtime = (config: ResolvedConfig) => Awaitable<RuntimeData>;
