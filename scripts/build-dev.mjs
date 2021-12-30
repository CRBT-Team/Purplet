import { build } from 'esbuild';
import fs from 'fs-extra';

const pkg = JSON.parse(fs.readFileSync('./package.json'));
const dependencies = Object.keys(pkg.dependencies);

fs.ensureDirSync('node_modules/purplet');
fs.writeFileSync('node_modules/purplet/index.mjs', 'export * from "../../dist/index.mjs"');
fs.writeFileSync(
  'node_modules/purplet/package.json',
  JSON.stringify({
    ...pkg,
    module: 'index.mjs',
    main: 'index.mjs',
  })
);

build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/index.mjs',
  format: 'esm',
  target: 'node16',
  platform: 'node',
  bundle: true,
  external: dependencies,
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'),
  },
  banner: {
    js: '#!/usr/bin/env node',
  },
});
