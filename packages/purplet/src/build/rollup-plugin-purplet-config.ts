import type { Plugin } from 'rollup';
import dynamicVirtual from './rollup-plugin-dynamic-virtual';
import { ResolvedConfig, RUNTIME_CONFIG_KEYS } from '../config/types';

/** Provides `$$config` */
export function pluginConfig(config: ResolvedConfig): Plugin {
  const runtimeConfig = {} as any;
  for (const key of RUNTIME_CONFIG_KEYS) {
    runtimeConfig[key] = config[key];
  }

  return {
    ...dynamicVirtual([
      {
        match: /^\$\$config$/,
        load: () => `export default ${JSON.stringify(runtimeConfig)}`,
      },
    ]),
    name: 'plugin-purplet-config',
  };
}
