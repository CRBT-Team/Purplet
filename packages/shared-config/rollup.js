import resolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import external from 'rollup-plugin-all-external';
import dtsPoint from './rollup-plugin-tsc-point.js';
import del from 'rollup-plugin-delete';
import shebang from 'rollup-plugin-add-shebang';
import replace from '@rollup/plugin-replace';
import { readJSONSync } from '@paperdave/utils';

export function library({ input }) {
  let version = '0.0.0-unknown';

  try {
    version = String(readJSONSync('./package.json').version ?? version);

    if (process.argv.includes('-w') || process.argv.includes('--watch')) {
      version = version.replace(/-.*$/, '-dev');
    }
  } catch {}

  return {
    input,
    output: {
      dir: 'dist',
      format: 'esm',
      chunkFileNames: '[name].js',
    },
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          __VERSION__: version,
          v__VERSION__: 'v' + version,
        },
      }),
      resolve({
        extensions: ['.mjs', '.js', '.ts', '.json'],
      }),
      esbuild({
        target: 'esnext',
      }),
      shebang(),
      external(),
      dtsPoint(),
      del({ targets: 'dist/**/*' }),
      {
        name: 'external-bugfix',
        resolveId: {
          order: 'pre',
          handler(source) {
            if (source.includes('node_modules')) {
              return {
                id: source,
                external: true,
              };
            }
            return null;
          },
        },
      },
    ],
  };
}
