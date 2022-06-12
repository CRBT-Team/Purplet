import { Config } from 'purplet';

const config: Config = {
  alias: {
    $lib: 'src/lib',
  },
  paths: {
    build: '{output}/build',
    features: 'src/features',
    output: '.purplet',
    translations: './todo/undetermined',
  },
  vite: () => ({}),
};

export default config;
