// @ts-nocheck
import fs from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import esbuild from 'rollup-plugin-esbuild';
import shebang from 'rollup-plugin-add-shebang';
import pkg from './package.json';

fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist');

/** @type {string[]} */
const external = [].concat(
  Object.keys(pkg.dependencies ?? {}),
  Object.keys(pkg.peerDependencies ?? {}),
  Object.keys(process.binding('natives'))
);

const version = process.argv.includes('--watch')
  ? pkg.version.replace(/-.*$/, '-dev')
  : pkg.version;

/** @type {import('rollup').RollupOptions[]} */
const config = [
  {
    input: {
      index: 'src/index.ts',
    },
    output: {
      dir: 'dist',
      format: 'esm',
      chunkFileNames: '[name].js',
    },
    external: id => id.startsWith('node:') || external.some(x => id.startsWith(x)),
    plugins: [
      resolve({
        extensions: ['.mjs', '.js', '.ts', '.json'],
      }),
      json(),
      esbuild({
        target: 'esnext'
      }),
      shebang(),
      {
        name: 'rollup-plugin-no-empty-imports',
        renderChunk(code, chunk, options) {
          return code.replace(/^import '.*?';$/gm, '');
        }
      }
    ],
  },
];

export default config;