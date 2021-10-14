import { generateDtsBundle } from 'dts-bundle-generator';
import { build } from 'esbuild';
import fs from 'fs-extra';

fs.ensureDirSync('dist');

const pkg = JSON.parse(fs.readFileSync('./package.json'));
const dependencies = Object.keys(pkg.dependencies);

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

const x = generateDtsBundle([{ filePath: './src/index.ts' }]);
fs.writeFileSync('./dist/purplet.d.ts', x[0]);
