// @ts-nocheck
import commonjs from '@rollup/plugin-commonjs';
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
      cli: 'src/cli/cli.ts',
      lib: 'src/lib/index.ts',
    },
    output: {
      dir: 'dist',
      format: 'esm',
      chunkFileNames: '[name].js',
    },
    external: id => {
      return id.startsWith('node:') || external.some(x => id.startsWith(x));
    },
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          __VERSION__: pkg.version,
        },
      }),
      resolve({
        extensions: ['.mjs', '.js', '.ts', '.json'],
      }),
      esbuild(),
      commonjs(),
      shebang(),
    ],
  },
];
