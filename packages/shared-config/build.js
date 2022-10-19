#!/usr/bin/env node
import { execa } from 'execa';
import { rmSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

rmSync('dist', { recursive: true, force: true });
try {
  await execa(require.resolve('rollup/dist/bin/rollup'), ['-c'], { stdio: 'inherit' });
  await execa(require.resolve('typescript/bin/tsc'), ['-p', '.'], { stdio: 'inherit' });
} catch {
  process.exit(1);
}
