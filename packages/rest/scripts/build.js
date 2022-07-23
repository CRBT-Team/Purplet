import { execSync } from 'child_process';
import { copyFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const dir = dirname(fileURLToPath(import.meta.url));

execSync(`node ${dir}/gen-routes.js`, { stdio: 'inherit' });
execSync('pnpm rollup -c', { stdio: 'inherit' });
try {
  execSync('pnpm tsc -p .', { stdio: 'inherit' });
} catch (error) {
  console.log('WARN: tsc failed');
}

copyFileSync('src/route-group.d.ts', 'dist/route-group.d.ts');
copyFileSync('src/routes.generated.d.ts', 'dist/routes.generated.d.ts');
