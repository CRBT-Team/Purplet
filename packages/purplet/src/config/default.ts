import type { ResolvedConfig } from './options';

const config: ResolvedConfig = {
  alias: {
    $lib: 'src/lib',
  },
  lang: 'en-US',
  paths: {
    features: 'src/features',
    output: '.purplet',
    translations: './todo/undetermined',
  },
  vite: () => ({}),
};

export default config;
