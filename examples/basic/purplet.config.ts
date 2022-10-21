import type { Config } from 'purplet';
import { gateway } from 'purplet/adapters';

const config: Config = {
  adapter: gateway(),
};

export default config;
