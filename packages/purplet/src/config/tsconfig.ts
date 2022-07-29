import dedent from 'dedent';
import path from 'path';
import { asyncMap } from '@paperdave/utils';
import { readdir, readFile, writeFile } from 'fs/promises';
import type { ResolvedConfig } from './types';
import { log } from '../lib/logger';
import { isDirectory, posixify, resolveEntrypoint, writeIfChanged } from '../utils/fs';

const searchPaths = ['tsconfig.json', 'jsconfig.json'];

export async function writeTSConfig(config: ResolvedConfig) {
  const files = await readdir(config.root);
  const matched = searchPaths.filter(file => files.includes(file));

  const rootRelative = (file: string) => posixify(path.relative(config.root, file));
  const tempRelative = (file: string) => posixify(path.relative(config.temp, file));

  const shouldExtends = posixify(
    './' + path.relative(config.root, path.resolve(config.root, config.temp, 'tsconfig.json'))
  );

  let userTSConfig;
  if (matched.length === 0) {
    log('info', 'Generating a tsconfig.json file, as it was not found in your project.');
    userTSConfig = {
      extends: shouldExtends,
    };
    await writeFile(`${config.root}/tsconfig.json`, JSON.stringify(userTSConfig, null, 2), 'utf8');
  } else if (matched.length > 1) {
    log(
      'warn',
      'Found multiple typescript configuration files in your project. Please remove one of the following:\n' +
        matched.map(x => ` - ${x}`).join('\n')
    );
    userTSConfig = JSON.parse(await readFile(`${config.root}/${matched[0]}`, 'utf8'));
  } else {
    userTSConfig = JSON.parse(await readFile(`${config.root}/${matched[0]}`, 'utf8'));
  }

  if (userTSConfig.extends !== shouldExtends) {
    log(
      'warn',
      dedent`
        Your ${matched[0]} does not extend the Purplet generated tsconfig. Please update your ${matched[0]} with:
          "extends": "${shouldExtends}"
      `
    );
  }

  const dirs = new Set([rootRelative(path.dirname(config.paths.features))]);

  const include = [];
  dirs.forEach(dir => {
    include.push(tempRelative(`${dir}/**/*.js`));
    include.push(tempRelative(`${dir}/**/*.ts`));
    include.push(tempRelative(`${dir}/**/*.svelte`));
  });

  const paths: Record<string, string[]> = {};
  await asyncMap(Object.entries(config.alias), async ([key, value]) => {
    const absolute = path.resolve(config.root, value);

    // Direct alias emiited only if a resolved file exists.
    const resolved = await resolveEntrypoint(absolute);
    if (resolved) {
      paths[key] = [rootRelative(resolved) + key.endsWith('/*') ? '/*' : ''];
    }

    // Wildcard aliases are emitted only if a directory exists, but skip if a '/*' alias is given.
    if (await isDirectory(absolute)) {
      paths[key.endsWith('/*') ? key : key + '/*'] = [rootRelative(absolute) + '/*'];
    }
  });

  const tsconfig = {
    compilerOptions: {
      baseUrl: tempRelative('.'),
      rootDirs: [tempRelative('.')],
      paths,
      types: ['purplet'],

      // Vite compiles modules one at a time
      isolatedModules: true,

      // JSON files are importable by vite
      resolveJsonModule: true,

      // Purplet-opinionated default settings
      lib: ['esnext'],
      moduleResolution: 'node',
      module: 'esnext',
      target: 'esnext',
      strict: true,
      forceConsistentCasingInFileNames: true,
      esModuleInterop: true,
    },
    include: [
      //
      tempRelative('src'),
    ],
  };

  await writeIfChanged(path.join(config.temp, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
}
