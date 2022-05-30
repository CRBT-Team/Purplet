// This configuration is modelled after what SvelteKit uses to bundle their app.

// @ts-nocheck
import fs from 'fs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import shebang from 'rollup-plugin-add-shebang';
import pkg from './package.json';

fs.rmSync('dist', { recursive: true, force: true });

/** @type {string[]} */
const external = [].concat(
  Object.keys(pkg.dependencies ?? {}),
  Object.keys(pkg.peerDependencies ?? {}),
  Object.keys(process.binding('natives'))
);

export default [
  {
    input: {
      cli: 'src/cli.ts',
      build: 'src/build-api.ts',
      lib: 'src/index.ts',
      internal: 'src/internal.ts',
    },
    output: {
      dir: 'dist',
      format: 'esm',
      chunkFileNames: '[name].js',
    },
    external: id => id.startsWith('node:') || external.some(x => id.startsWith(x)),
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          __VERSION__: pkg.version,
          v__VERSION__: 'v' + pkg.version,
        },
      }),
      resolve({
        extensions: ['.mjs', '.js', '.ts', '.json'],
      }),
      esbuild(),
      shebang(),
    ],
  },
];
