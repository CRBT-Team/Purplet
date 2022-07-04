import { rollup } from 'rollup';
import { copyFile, mkdir, readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import minimatch from 'minimatch';

process.env.NODE_ENV = 'production';

console.log('Building Rollup');
const rollupConfig = (await import('./rollup.config.js')).default;
const roll = await rollup(rollupConfig);
await roll.write(rollupConfig.output);

const examples = (await readdir('../../examples')).filter(x =>
  existsSync(path.join('../../examples', x, '.template.json'))
);

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
    const files = (await readdir(src)).filter(file =>
      !ignore.some(match => {
        return match === file;
      })
    );
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
    ])
  )
);
