import type { Awaitable, DeepPartial, ForceSimplify } from '@paperdave/utils';
import type { AllowedMentionsTypes } from 'purplet/types';
import type { UserConfig as ViteConfig } from 'vite';

export interface ResolvedConfig {
  /** Not included in user configuration; This is the root directory of the project. */
  root: string;
  /** Not included in user configuration; This is the `.purplet` directory of the project. */
  temp: string;

  alias: Record<string, string>;
  allowedMentions: {
    parse: Array<AllowedMentionsTypes | 'everyone' | 'roles' | 'users'>;
    repliedUser: boolean;
  };
  build: {
    runtimes: PurpletBuildRuntime[];
  };
  lang: string;
  paths: {
    build: string;
    features: string;
    translations: string;
  };
  vite: ViteConfig | (() => Awaitable<ViteConfig>);
}

export type PurpletBuildRuntime =
  | 'auto'
  | 'auto-http'
  | 'bun'
  | 'cloudflare-workers'
  | 'express'
  | 'gateway'
  | 'gateway-slim'
  | 'vercel-edge-function';

export type Config = ForceSimplify<DeepPartial<Omit<ResolvedConfig, 'root'>>>;
