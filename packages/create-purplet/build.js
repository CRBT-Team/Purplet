import { rollup } from 'rollup';
import { copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

process.env.NODE_ENV = 'production';

const rollupConfig = (await import('./rollup.config.js')).default;
const roll = await rollup(rollupConfig);
await roll.write(rollupConfig.output);

const examples = (await readdir('../../examples'))
  .filter(x => existsSync(path.join('../../examples', x, '.template.json')))
  .filter(x => !x.startsWith('local-'));

async function mkdirp(root) {
  try {
    await mkdir(root, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function copy(src, dest, ignore = []) {
  const stats = await stat(src);
  if (stats.isDirectory()) {
    await mkdirp(dest);
    const files = (await readdir(src)).filter(file => !ignore.some(match => match === file));
    await Promise.all(
      files.map(async file => {
        await copy(path.join(src, file), path.join(dest, file), ignore);
      })
    );
  } else {
    await copyFile(src, dest);
  }
}

await Promise.all(
  examples.map(x =>
    copy(path.join('../../examples', x), path.join('dist/templates', x), [
      'node_modules',
      'dist',
      '.purplet',
      '.env',
    ])
  )
);
