import dedent from 'dedent';
import { build as esbuild } from 'esbuild';
import fs, { pathExists } from 'fs-extra';
import path from 'path';
import type { Args } from '.';
import { readDirRecursive } from '../util/readDirRecursive';
import { loadConfig } from './load-config';
import { getTempFolder } from './temp';

export async function build(args: Args) {
  console.log('Building bot');
  const configFile = path.resolve(args.root, 'purplet.config.ts');
  const config = await loadConfig(args);

  const modulePath = config.compiler?.modulesPath
    ? path.resolve(args.root, config.compiler?.modulesPath)
    : [
        //
        path.resolve(args.root, 'src', 'modules'),
        path.resolve(args.root, 'modules'),
      ].find((x) => fs.existsSync(x));
  if (!modulePath) {
    throw new Error('No modules path found. Create a directory at ./src/modules');
  }
  const moduleList = (await pathExists(modulePath)) ? await readDirRecursive(modulePath) : [];

  const handlerPath = config.compiler?.handlersPath
    ? path.resolve(args.root, config.compiler?.handlersPath)
    : [
        //
        path.resolve(args.root, 'src', 'handlers'),
        path.resolve(args.root, 'handlers'),
      ].find((x) => fs.existsSync(x));
  const handlerList = handlerPath ? await readDirRecursive(handlerPath) : [];

  const entryGeneratedFile = path.join(await getTempFolder(), 'entry.mjs');

  await fs.writeFile(
    entryGeneratedFile,
    [
      dedent`
        import { Purplet, Handler, setupEnv } from 'purplet';
        setupEnv();

        import config from '${configFile.replace(/\\/g, '\\\\').replace(/\.[^.]+$/, '')}';
      `,
      '',
      ...moduleList.map((module) => {
        const relativePath = path.relative(modulePath, module);
        const moduleId = relativePath.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
        const moduleFile = module.replace(/\\/g, '\\\\').replace(/\.[tj]s/g, '');
        return `import * as module_${moduleId} from "${moduleFile}";`;
      }),
      '',
      ...handlerList.map((module) => {
        const relativePath = path.relative(modulePath, module);
        const moduleId = relativePath.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
        const moduleFile = module.replace(/\\/g, '\\\\').replace(/\.[tj]s/g, '');
        return `import * as handler_${moduleId} from "${moduleFile}";`;
      }),
      '',
      `const modules = {`,
      ...moduleList.map((module, i) => {
        const relativePath = path.relative(modulePath, module);
        const moduleId = relativePath.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
        return `  m${i}: module_${moduleId}`;
      }),
      `};`,
      '',
      dedent`
        function filterHandlers(handlers) {
          return handlers
            .flatMap(x => Object.values(x))
            .filter(x => x.constructor instanceof Handler.constructor)
            .map(x => new x());
        }
      `,
      '',
      `const handlers = filterHandlers([`,
      handlerList
        .map(() => {
          return `  handler_${handlerList.length}`;
        })
        .join(',\n'),
      `]);`,
      '',
      dedent`
        (async() => {
          const conf = await config;
          config.handlers = (config.handlers ?? []).concat(...handlers);
          const bot = new Purplet(conf);
          bot.addModules(modules);
          bot.init();
        })();
      `,
    ].join('\n')
  );

  const pkg = await fs.readJSON(path.resolve(args.root, 'package.json'));

  const deps = Object.keys(pkg.dependencies ?? {})
    .concat(Object.keys(pkg.devDependencies ?? {}))
    .concat(Object.keys(pkg.peerDependencies ?? {}));

  const libAlias = [
    //
    path.resolve(args.root, 'src', 'lib'),
    path.resolve(args.root, 'lib'),
  ].find((x) => fs.existsSync(x));

  await esbuild({
    entryPoints: [entryGeneratedFile],
    outfile: path.join(args.root, 'dist', 'bot.mjs'),
    bundle: true,
    platform: 'node',
    target: 'node16',
    format: 'esm',
    sourcemap: true,
    external: ['purplet', 'discord.js', '@discordjs/rest', 'dotenv'].concat(deps),
    ...(config.compiler?.esbuildOptions ?? {}),
    plugins: [
      // add plugins here
      ...(config.compiler?.esbuildPlugins ?? []),
    ],
  });

  if (!args['keep-tmp']) {
    await fs.remove(entryGeneratedFile);
  }

  console.log('Purplet Built!');
}
