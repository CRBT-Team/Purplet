import type { Awaitable, DeepPartial } from '@davecode/types';
import type { UserConfig as ViteConfig } from 'vite';

export interface ResolvedConfig {
  alias: Record<string, string>;
  paths: {
    features: string;
    output: string;
    translations: string;
  };
  vite: ViteConfig | (() => Awaitable<ViteConfig>);
}

export type Config = DeepPartial<ResolvedConfig>;
