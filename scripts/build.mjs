import { build } from 'esbuild';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json'));
const dependencies = Object.keys(pkg.dependencies);

fs.ensureDirSync('node_modules/purplet');
fs.writeFileSync('node_modules/purplet/index.mjs', 'export * from "../../dist/index.mjs"');
fs.writeJSONSync('node_modules/purplet/package.json', {
  ...pkg,
  module: 'index.mjs',
  main: 'index.mjs',
});

build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/index.mjs',
  format: 'esm',
  target: 'node16',
  platform: 'node',
  bundle: true,
  external: dependencies,
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
