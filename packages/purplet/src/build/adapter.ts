import type { LogFunction } from '@paperdave/logger';
import type { Awaitable, Immutable } from '@paperdave/utils';
import type { InputOptionsWithPlugins, OutputOptions, Plugin } from 'rollup';
import type { ResolvedConfig } from '../config/types';

export interface PurpletRollupOptions extends InputOptionsWithPlugins {
  // This is included for compatibility with config files but ignored by rollup.rollup
  output?: OutputOptions | OutputOptions[];
}

export interface Adapter {
  name: string;
  version?: string;
  input: string;
  /** JSON data available via `import '$$options'` */
  options?: any;

  config?(event: RollupConfigEvent): Awaitable<void>;
  adapt(event: AdaptEvent): Awaitable<void>;
}

export interface RollupConfigEvent {
  config: Immutable<ResolvedConfig>;
  rollup: PurpletRollupOptions;

  addRollupPlugin(plugin: Plugin): void;
  addExternal(id: string): void;
}

export interface AdaptEvent {
  config: Immutable<ResolvedConfig>;

  log: LogFunction;
  debug: LogFunction;

  rimraf(dir: string): void;
  mkdirp(dir: string): void;

  getBuildDir(): string;
  getTempDir(): string;
  getSourceDir(): string;

  writeRollup(distDir?: string): Promise<void>;
}
