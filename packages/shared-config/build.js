#!/usr/bin/env node
import { Logger } from '@paperdave/logger';
import { readJSONSync, tryOrFallback, walk } from '@paperdave/utils';
import { execa } from 'execa';
import { copyFileSync, rmSync } from 'fs';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);

const pkg = tryOrFallback(() => readJSONSync('./package.json'), null);
if (!pkg) {
  Logger.error('not in a package');
  process.exit(1);
}

Logger.info('Building ' + pkg.name);

const sourceRoot = path.resolve('src');
const distRoot = path.resolve('dist');

rmSync(distRoot, { recursive: true, force: true });

try {
  await execa(require.resolve('rollup/dist/bin/rollup'), ['-c'], { stdio: 'inherit' });
} catch {
  Logger.error('Rollup build failed.');
  process.exit(1);
}

try {
  await execa(require.resolve('typescript/bin/tsc'), ['-p', '.'], { stdio: 'inherit' });
} catch {
  Logger.warn('There are type errors in the project. See above.');
}

for await (const file of walk(sourceRoot, { files: true })) {
  if (file.endsWith('.d.ts')) {
    const rel = path.relative(sourceRoot, file);
    Logger.info('copying ' + rel);
    copyFileSync(path.join(sourceRoot, rel), path.join(distRoot, rel));
  }
}

Logger.success('Finished build of ' + pkg.name);
