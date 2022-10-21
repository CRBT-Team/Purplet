import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import external from 'rollup-plugin-all-external';
import dtsPoint from './rollup-plugin-tsc-point.js';
import del from 'rollup-plugin-delete';
import shebang from 'rollup-plugin-add-shebang';
import replace from '@rollup/plugin-replace';
import path from 'path';
import { readJSONSync } from '@paperdave/utils';

export function createRollupConfig({ input, cli = false, plugins = [] }) {
  const sourceRoot = path.resolve('.');
  const repoRoot = path.resolve('../');
  const outputRoot = path.resolve('./dist');

  let version = '0.0.0-unknown';
  let pname = undefined;

  try {
    const pkg = readJSONSync('./package.json');
    pname = pkg.name;
    version = String(pkg.version ?? version);

    if (process.argv.includes('-w') || process.argv.includes('--watch')) {
      version = version.replace(/-.*$/, '-dev');
    }
  } catch {}

  let mainEntrypoint = typeof input === 'string' ? input : input.index;
  mainEntrypoint = mainEntrypoint && path.resolve(mainEntrypoint);

  const aliasEntries = {};
  if (pname) {
    if (typeof input === 'object') {
      for (const key in input) {
        aliasEntries[`${pname}/${key}`] = path.resolve(input[key]);
      }
    }

    if (mainEntrypoint) {
      aliasEntries[pname] = path.resolve(mainEntrypoint);
    }
  }

  return {
    input,
    output: {
      dir: outputRoot,
      format: 'esm',
      chunkFileNames: '[name].js',
    },
    treeshake: {
      moduleSideEffects: false,
    },
    plugins: [
      {
        name: 'externals',
        resolveId: {
          order: 'pre',
          handler(source) {
            if (
              source.includes('node_modules') ||
              (source.startsWith(repoRoot) && !source.startsWith(sourceRoot))
            ) {
              return {
                id: source,
                external: true,
                moduleSideEffects: false,
              };
            }
            return null;
          },
        },
      },
      replace({
        preventAssignment: true,
        values: {
          __VERSION__: version,
          v__VERSION__: 'v' + version,
        },
      }),
      json(),
      alias({
        entries: aliasEntries,
      }),
      resolve({
        extensions: ['.mjs', '.js', '.ts', '.json'],
      }),
      esbuild({
        target: 'esnext',
      }),
      shebang({
        include: cli ? 'dist/index.js' : undefined,
      }),
      external(),
      del({ targets: 'dist/**/*' }),
      dtsPoint(),
      ...plugins,
    ],
  };
}
