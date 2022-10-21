import type { Plugin } from 'rollup';
import dynamicVirtual from './rollup-plugin-dynamic-virtual';
import { escapeJSString } from './rollup-plugin-purplet-features';

/** Provides `$$entrypoint` */
export function pluginEntrypoints(entrypoints: string[]): Plugin {
  const dynamic = dynamicVirtual('entry', [
    {
      match: /^\$\$entrypoint$/,
      load: () => entrypoints.map(x => `import '${escapeJSString(x)}';`),
    },
  ]);

  return {
    ...dynamic,
    resolveId(id) {
      const result = (dynamic as any).resolveId(id);
      if (result) {
        return result;
      }

      // Force entrypoints to be non external
      if (entrypoints.includes(id)) {
        return {
          id,
          external: false,
        };
      }
    },
  };
}
