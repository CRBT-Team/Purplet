import { execSync } from 'child_process';
import { warn } from '@paperdave/logger';
import { copyFileSync } from 'fs';

execSync('node scripts/gen-routes.js', { stdio: 'inherit' });
execSync('pnpm rollup -c', { stdio: 'inherit' });
try {
  execSync('pnpm tsc -p .', { stdio: 'inherit' });
} catch (error) {
  warn('tsc failed');
}

copyFileSync('src/route-group.d.ts', 'dist/route-group.d.ts');
copyFileSync('src/routes.generated.d.ts', 'dist/routes.generated.d.ts');
