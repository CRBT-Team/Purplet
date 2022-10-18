import path from 'path';
import { unique } from '@paperdave/utils';
import type { Plugin } from 'rollup';
import type { ResolvedConfig } from '../config/types';
import type { FeatureScan } from '../internal';

export interface FeatureArrayPluginOptions {
  config: ResolvedConfig;
  featureScan: FeatureScan;
}

export function rollupPluginFeatureArray({
  config,
  featureScan,
}: FeatureArrayPluginOptions): Plugin {
  return {
    name: 'rollup-plugin-feature-array',
    resolveId(source, importer, options) {
      if (source.startsWith('purplet/features') || source.startsWith('purplet/mark?')) {
        return {
          id: source,
          moduleSideEffects: false,
        };
      }
      return null;
    },
    load(source) {
      if (source.startsWith('purplet/features')) {
        const type = source.includes('?') ? source.slice(source.indexOf('?') + 1) : null;
        if (type == null) {
          return [
            ...Object.keys(featureScan).map(x => `import ${x} from 'purplet/features?${x}'`),
            'export default [',
            ...Object.keys(featureScan).map(x => `  ...${x},`),
            '];',
          ].join('\n');
        }

        const files = featureScan[type];

        if (!files) {
          return `export default []`;
        }

        const moduleFeature = Object.entries(files).map(([name, exports], index) => ({
          id: `${path
            .relative(config.paths.features, name)
            .replace(/\.[jt]sx?$/, '')
            .replace(/[^a-z0-9]/g, '_')
            .replace(/^_+|(_)_+|_+$/g, '$1')}_${index}`,
          name,
          full: path.join(config.paths.features, name),
          exports,
        }));

        return [
          ...moduleFeature.map(({ full, name, exports, id }) => {
            const importSymbols = unique(exports.map(x => x.replace(/\[.*$/, '')));

            const nonDefaultImportSymbols = importSymbols.filter(x => x !== 'default');
            const defaultImportSymbol = importSymbols.includes('default');

            return [
              `import { unmerge } from 'purplet/internal'`,
              `import ${defaultImportSymbol ? id : ''}${
                nonDefaultImportSymbols.length
                  ? `{ ${nonDefaultImportSymbols
                      .map(symbol => `${symbol} as ${id}_${symbol}`)
                      .join(', ')} }`
                  : ''
              } from '${full.replace(/[\\']/g, '\\$&')}'`,
              `import mark_${id} from 'purplet/mark?${encodeURIComponent(name)}'`,
            ];
          }),
          'export default [',
          ...moduleFeature.map(({ id, exports }) =>
            exports.map(exportName => {
              const base = `${id}${exportName.replace(/^default\b/, '')}`;
              const unmergeMatch = /(.*)\[(\d*)]/.exec(base);
              return `  mark_${id}('${exportName}', ${
                unmergeMatch ? `unmerge(${unmergeMatch[1]})[${unmergeMatch[2]}]` : base
              }),`;
            })
          ),
          ']',
        ]
          .flat()
          .join('\n');
      } else if (source.startsWith('purplet/mark')) {
        const toMark = decodeURIComponent(source.split('?')[1]);

        return [
          `import { markFeature } from 'purplet/internal'`,
          `export default (id, feat) => markFeature(feat, '${toMark.replace(
            /['\n]/,
            '\\$&'
          )}', id)`,
        ].join('\n');
      }

      return null;
    },
  };
}
