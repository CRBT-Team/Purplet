import { build as esbuild } from 'esbuild';
import path from 'path';
import { Args } from '.';
import { Config } from '../Config';
import { getTempFolder } from './temp';

export async function loadConfig(args: Args) {
  const outfile = path.join(await getTempFolder(), 'config.mjs');

  await esbuild({
    entryPoints: [path.resolve(args.root, 'purplet.config.ts')],
    external: ['purplet'],
    bundle: true,
    format: 'esm',
    outfile,
  });

  const imported = await (await import('file://' + outfile)).default;

  return imported as Config;
}
