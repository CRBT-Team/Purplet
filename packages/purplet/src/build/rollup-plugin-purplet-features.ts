import path from 'path';
import { unique } from '@paperdave/utils';
import type { Plugin } from 'rollup';
import dynamicVirtual from './rollup-plugin-dynamic-virtual';
import type { ResolvedConfig } from '../config/types';
import type { FeatureScan } from '../internal';

export interface FeaturesPluginOptions {
  config: ResolvedConfig;
  featureScan: FeatureScan;
}

export function escapeJSString(str: string) {
  return str.replace(/\\/gi, '\\\\').replace(/"/gi, '\\"');
}

function escapeJSIdent(str: string) {
  return str
    .replace(/\/|\\/g, '__')
    .replace(/-/g, '_')
    .replace(/[^a-z0-9_]/gi, x => `$${x.charCodeAt(0).toString(16)}`);
}

/** Provides `$$features` */
export function pluginFeatures({ config, featureScan }: FeaturesPluginOptions): Plugin {
  const hookIDs = Object.keys(featureScan);
  const featureScanValues = Object.values(featureScan);
  const fileNameList = unique(featureScanValues.map(x => Object.keys(x)).flat());
  const namesWithSymbols = fileNameList.map(filename => {
    const fileID = escapeJSIdent(filename.replace(/\.[jt]sx?$/, ''));
    const exportIds = featureScanValues
      .map(x => x[filename])
      .filter(Boolean)
      .flat();
    const importPath = escapeJSString(path.join(config.paths.features, filename));
    const symbols = unique(exportIds.map(x => x.replace(/\[.*$/, '')));

    return {
      filename,
      exportIds,
      fileID,
      importPath,
      symbols,
    };
  });

  return dynamicVirtual('features', [
    {
      /**
       * This approach is pretty good for tree shaking. But there are a couple of issues with this
       * and minification and inlining. Honestly, the problems are too complex to explain, and
       * fixing them probably wont save too much space. (summary, try to wrap each hook in
       * markFeature instead of doing this import trickery here)
       */
      match: /^\$\$features\/_marked\/(.*)$/,
      load: fileID => {
        const { filename, symbols, importPath } = namesWithSymbols.find(x => x.fileID === fileID)!;

        const importMappings = symbols.map(id => {
          return `${id} as _${fileID}$$${id}`;
        });

        return [
          `import { markFeature } from 'purplet/internal'`,
          `import { ${importMappings} } from '${importPath}'`,
          `const i_${fileID} = '${escapeJSString(filename)}'`,
          ...symbols.map(id => {
            return `export const ${fileID}$$${id} = markFeature(i_${fileID}, '${id}', _${fileID}$$${id})`;
          }),
        ];
      },
    },
    {
      match: /^\$\$features$/,
      load: () => {
        return [
          ...namesWithSymbols
            .map(({ fileID, symbols }) => {
              const imports = symbols.map(id => `${fileID}$$${id}`).join(',');
              return `import { ${imports} } from '$$features/_marked/${fileID}'`;
            })
            .flat(),
          'export default [',
          ...namesWithSymbols
            .map(({ fileID, symbols }) => {
              return symbols.map(id => `  ${fileID}$$${id},`);
            })
            .flat(),
          '];',
        ];
      },
    },
    {
      match: /^\$\$features\/(.*)$/,
      load(id) {
        const toInclude = id.split('+').filter(x => hookIDs.includes(x));
        if (toInclude.length === 0) {
          return `export default []`;
        }

        const merged: Dict<string[]> = {};
        for (const hookID of toInclude) {
          const hook = featureScan[hookID];
          for (const filename of Object.keys(hook)) {
            merged[filename] = (merged[filename] || []).concat(hook[filename]);
          }
        }

        return [
          `import { unmerge } from 'purplet/internal'`,
          ...Object.entries(merged)
            .map(([filename, ids]) => {
              const fileID = escapeJSIdent(filename.replace(/\.[jt]sx?$/, ''));
              const symbols = unique((ids as string[]).map(x => x.replace(/\[.*$/, '')));
              const imports = symbols.map(id => `${fileID}$$${id}`).join(',');
              return `import { ${imports} } from '$$features/_marked/${fileID}'`;
            })
            .flat(),
          'export default [',
          ...Object.entries(merged)
            .map(([filename, ids]) => {
              const fileID = escapeJSIdent(filename.replace(/\.[jt]sx?$/, ''));
              return (ids as string[]).map(id => {
                const match = id.match(/^(.*)\[(.*)\]$/);
                if (match) {
                  return `  unmerge(${fileID}$$${match[1]})[${match[2]}],`;
                } else {
                  return `  ${fileID}$$${id},`;
                }
              });
            })
            .flat(),
          '];',
        ];
      },
    },
  ]);
}
