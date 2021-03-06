// This configuration is modelled after what SvelteKit uses to bundle their app.

// @ts-nocheck
import fs from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import pkg from './package.json';

fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist');

/** @type {string[]} */
const external = [].concat(
  Object.keys(pkg.dependencies ?? {}),
  Object.keys(pkg.peerDependencies ?? {}),
  Object.keys(process.binding('natives'))
);

export default [
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
      esbuild(),
      // This plugin is used to get types when working in other packages in this monorepo,
      // without having to build the types, and F12 jump to definiton even brings you to the source.
      // We can't publish the package like this, so we only run the hook during watch
      {
        name: 'rollup-plugin-tsc-point',
        options(opts) {
          if (!opts.watch) {
            return;
          }
          for (const [name, input] of Object.entries(opts.input)) {
            fs.writeFileSync(
              `dist/${name}.d.ts`,
              `export * from '../${input.replace(/\.ts$/, '')}';`
            );
          }
        },
      },
    ],
  },
];
