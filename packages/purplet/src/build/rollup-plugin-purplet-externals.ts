import type { Plugin } from 'rollup';
import { purpletSourceCode } from '../utils/fs';

export function pluginPurpletExternals(): Plugin {
  return {
    name: 'purplet-externals',
    resolveId(id) {
      if (id.includes('node_modules') || id.startsWith(purpletSourceCode)) {
        return {
          id,
          external: true,
        };
      }
      return null;
    },
  };
}
