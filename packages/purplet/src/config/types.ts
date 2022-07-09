import type { Awaitable, DeepPartial, ForceSimplify } from '@davecode/types';
import type { AllowedMentionsTypes } from 'purplet/types';
import type { UserConfig as ViteConfig } from 'vite';

export interface ResolvedConfig {
  /** Not included in user configuration; This is the root directory of the project. */
  root: string;
  /** Not included in user configuration; This is the `.purplet` directory of the project. */
  temp: string;

  alias: Record<string, string>;
  allowedMentions: {
    parse: (AllowedMentionsTypes | 'everyone' | 'roles' | 'users')[];
    repliedUser: boolean;
  };
  lang: string;
  paths: {
    build: string;
    features: string;
    translations: string;
  };
  vite: ViteConfig | (() => Awaitable<ViteConfig>);
}

export type Config = ForceSimplify<DeepPartial<Omit<ResolvedConfig, 'root'>>>;
