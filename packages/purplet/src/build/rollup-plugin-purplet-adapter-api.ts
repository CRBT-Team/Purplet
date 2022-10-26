import type { Plugin } from 'rollup';
import dynamicVirtual from './rollup-plugin-dynamic-virtual';

/** Provides `$$adapter` */
export function pluginAdapterAPI(): Plugin {
  return dynamicVirtual('adapter-api', [
    {
      match: /^\$\$adapter$/,
      load: () => `export { setGlobalEnv, GatewayBot, setRestOptions } from 'purplet/internal'`,
    },
  ]);
}
