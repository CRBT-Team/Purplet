// This configuration is modelled after what SvelteKit uses to bundle their app.
import fs from 'fs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import esbuild from 'rollup-plugin-esbuild';
import shebang from 'rollup-plugin-add-shebang';
import pkg from './package.json';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist');

/** @type {string[]} */
const external = [].concat(
  Object.keys(pkg.dependencies ?? {}),
  Object.keys(pkg.peerDependencies ?? {}),
  Object.keys(process.binding('natives')),
  'purplet'
);

const version = process.argv.includes('--watch')
  ? pkg.version.replace(/-.*$/, '-dev')
  : pkg.version;

/** @type {import('rollup').RollupOptions} */
const config = {
  input: {
    cli: 'src/cli/_cli.ts',
    index: 'src/index.ts',
    internal: 'src/internal.ts',
    types: 'src/types.ts',
    env: 'src/env.ts',
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
        __VERSION__: version,
        v__VERSION__: 'v' + version,
      },
    }),
    resolve({
      extensions: ['.mjs', '.js', '.ts', '.json'],
    }),
    alias({
      entries: {
        $lib: path.join(__dirname, 'src/lib'),
        $utils: path.join(__dirname, 'src/utils'),
        $builders: path.join(__dirname, 'src/builders'),
        $structures: path.join(__dirname, 'src/structures'),
      },
    }),
    esbuild(),
    shebang(),
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
    // {
    //   name: 'rollup-plugin-no-empty-imports',
    //   renderChunk(code, chunk, options) {
    //     return code.replace(/^import '.*?';$/gm, '');
    //   },
    // },
  ],
};

export default config;
