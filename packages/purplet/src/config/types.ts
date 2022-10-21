import type { Awaitable, DeepPartial, ForceSimplify } from '@paperdave/utils';
import type { AllowedMentionsTypes } from 'discord-api-types/v10';
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
    //
  };
  injectLogger: boolean;
  lang: string;
  paths: {
    build: string;
    features: string;
    translations: string;
  };
  vite: ViteConfig | (() => Awaitable<ViteConfig>);
}

export const RUNTIME_CONFIG_KEYS = ['allowedMentions', 'lang', 'injectLogger'] as const;

export type Config = ForceSimplify<DeepPartial<Omit<ResolvedConfig, 'root' | 'temp'>>>;
export type RuntimeConfig = Pick<ResolvedConfig, typeof RUNTIME_CONFIG_KEYS[number]>;
