import type { Plugin } from 'rollup';
import dynamicVirtual from './rollup-plugin-dynamic-virtual';

/** Provides `$$pluginOptions` */
export function pluginOptions(options: any): Plugin {
  return dynamicVirtual('options', [
    {
      match: /^\$\$options$/,
      load: () => `export default ${JSON.stringify(options)}`,
    },
  ]);
}
