import { Logger } from '@paperdave/logger';
import type { Awaitable } from '@paperdave/utils';
import type { Plugin } from 'rollup';

export interface VirtualEntry {
  match: RegExp;
  load(...args: string[]): Awaitable<string | string[]>;
}

const PREFIX = `\0dynamic-virtual:`;

export default function dynamicVirtual(entries: VirtualEntry[]): Plugin {
  return {
    name: 'virtual-dynamic',

    resolveId(id) {
      for (const entry of entries) {
        if (entry.match.test(id)) return PREFIX + id;
      }

      return null;
    },

    async load(id) {
      if (id.startsWith(PREFIX)) {
        const idNoPrefix = id.slice(PREFIX.length);
        const entry = entries.find(x => x.match.test(idNoPrefix));
        if (entry) {
          let loaded = await entry.load(...entry.match.exec(idNoPrefix)!.slice(1));
          if (Array.isArray(loaded)) {
            loaded = loaded.join('\n');
          }
          Logger.debug('Dynamic Module %s:', idNoPrefix);
          Logger.debug('%s:', loaded);
          return loaded;
        }
      }

      return null;
    },
  };
}
