import { build as esbuild } from 'esbuild';
import fs, { remove } from 'fs-extra';
import path from 'path';
import type { Args } from '.';
import { Config } from '../Config';
import { getTempFolder } from './temp';

export async function loadConfig(args: Args) {
  const outfile = path.join(await getTempFolder(), 'purplet.config.mjs');

  const pkg = await fs.readJSON(path.resolve(args.root, 'package.json'));

  const deps = Object.keys(pkg.dependencies ?? {})
    .concat(Object.keys(pkg.devDependencies ?? {}))
    .concat(Object.keys(pkg.peerDependencies ?? {}));

  await esbuild({
    entryPoints: [path.resolve(args.root, 'purplet.config.ts')],
    external: ['purplet', ...deps],
    platform: 'node',
    bundle: true,
    format: 'esm',
    outfile,
  });

  const imported = await (await import('file://' + outfile)).default;

  if (!args['keep-tmp']) {
    remove(outfile);
  }

  return imported as Config;
}
