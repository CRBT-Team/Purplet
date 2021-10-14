import { build as esbuild } from 'esbuild';
import { remove } from 'fs-extra';
import path from 'path';
import type { Args } from '.';
import { Config } from '../Config';
import { getTempFolder } from './temp';

export async function loadConfig(args: Args) {
  const outfile = path.join(await getTempFolder(), 'purplet.config.mjs');

  await esbuild({
    entryPoints: [path.resolve(args.root, 'purplet.config.ts')],
    external: ['purplet'],
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
