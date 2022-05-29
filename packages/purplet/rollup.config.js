import commonjs from '@rollup/plugin-commonjs';
import fs from 'fs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import shebang from 'rollup-plugin-add-shebang';
import pkg from './package.json';

(fs.rmSync || fs.rmdirSync)('assets', { recursive: true, force: true });

const external = [].concat(
  Object.keys(pkg.dependencies || {}),
  Object.keys(pkg.peerDependencies || {}),
  Object.keys(process.binding('natives')),
  'typescript',
  'svelte2tsx'
);

export default [
  {
    input: {
      cli: 'src/cli/index.ts',
    },
    output: {
      dir: 'dist',
      format: 'esm',
    },
    external: id => {
      return id.startsWith('node:') || external.includes(id);
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
