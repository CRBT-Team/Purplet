import type { Awaitable, DeepPartial, ForceSimplify } from '@davecode/types';
import type { AllowedMentionsTypes } from 'discord-api-types/v10';
import type { UserConfig as ViteConfig } from 'vite';

export interface ResolvedConfig {
  /** Not included in user configuration; This is the root directory of the project. */
  root: string;
  alias: Record<string, string>;
  allowedMentions: {
    parse: AllowedMentionsTypes[];
    repliedUser: boolean;
  };
  lang: string;
  paths: {
    build: string;
    features: string;
    temp: string;
    translations: string;
  };
  vite: ViteConfig | (() => Awaitable<ViteConfig>);
}

export type Config = ForceSimplify<DeepPartial<Omit<ResolvedConfig, 'root'>>>;
