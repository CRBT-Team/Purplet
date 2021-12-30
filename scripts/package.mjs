import { generateDtsBundle } from 'dts-bundle-generator';
import { buildSync } from 'esbuild';
import fs from 'fs-extra';
import ora from 'ora';
import { isMainThread, parentPort, Worker } from 'worker_threads';

function main() {
  fs.ensureDirSync('dist');
  fs.emptyDirSync('dist');

  const pkg = JSON.parse(fs.readFileSync('./package.json'));
  const dependencies = Object.keys(pkg.dependencies);

  buildSync({
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
    banner: {
      js: '#!/usr/bin/env node',
    },
  });

  const x = generateDtsBundle([{ filePath: './src/index.ts' }]);
  fs.writeFileSync('./dist/purplet.d.ts', x[0]);

  parentPort?.postMessage('done');
}

if (isMainThread) {
  const spinner = ora('building purplet framework...').start();
  const worker = new Worker(new URL(import.meta.url));
  worker.on('message', () => {
    spinner.succeed('built purplet framework');
    process.exit();
  });
} else {
  main();
}
