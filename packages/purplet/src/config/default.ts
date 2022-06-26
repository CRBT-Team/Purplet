// This file is used to populate the default configuration in the documentation.
import type { ResolvedConfig } from './types';

const config: ResolvedConfig = {
  root: '',
  // START CONFIG
  alias: {
    $features: 'src/features',
    $lib: 'src/lib',
  },
  lang: 'en-US',
  paths: {
    build: 'dist',
    features: 'src/features',
    temp: '.purplet',
    translations: 'lang',
  },
  vite: () => ({}),
  // END CONFIG
};

export default config;
