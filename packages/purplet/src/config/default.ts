// This file is used to populate the default configuration in the documentation.
import type { ResolvedConfig } from './types';

const config: ResolvedConfig = {
  root: '',
  temp: '',
  // START CONFIG
  alias: {
    $features: 'src/features',
    $lib: 'src/lib',
  },
  allowedMentions: {
    repliedUser: false,
    parse: [],
  },
  lang: 'en-US',
  paths: {
    build: 'dist',
    features: 'src/features',
    translations: 'locales',
  },
  vite: () => ({}),
  // END CONFIG
};

export default config;
