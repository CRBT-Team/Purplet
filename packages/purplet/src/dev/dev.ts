import * as vite from 'vite';
import path from 'path';
import { watch } from 'chokidar';
import { createRequire } from 'module';
import { VitePluginPurpletHMRHook } from './hmr-hook';
import { GatewayBot } from '../lib/gateway';
import { moduleToFeatureArray } from '../utils/feature';
import { isSourceFile } from '../utils/filetypes';
import { walk } from '../utils/fs';
import { asyncMap } from '../utils/promise';
import { log, startSpinner } from '../lib/logger';

const purpletSourceCode = path
  .dirname(createRequire(import.meta.url).resolve('purplet'))
  .replace(/\\/g, '/');

export interface DevOptions {
  root: string;
}

export async function startDevelopmentBot(options: DevOptions) {
  const modulesPath = path.normalize(path.join(options.root, 'src/features'));

  const hmrWatcher = new VitePluginPurpletHMRHook();

  const viteServer = await vite.createServer({
    configFile: false,
    envFile: false,
    mode: 'development',
    root: options.root,
    logLevel: 'silent',
    plugins: [hmrWatcher],
    server: {
      watch: {
        ignored: purpletSourceCode,
      },
    },
    ssr: {
      external: [
        'purplet',
        'discord.js',
        'discord-api-types',
        '@discordjs/rest',
        '@discordjs/builders',
      ],
    },
  });

  if (purpletSourceCode.endsWith('packages/purplet/dist')) {
    // Most likely running from inside the monorepo. Maybe we want a better test for this?
    const watcher = watch(path.join(purpletSourceCode, '*.js')).on('change', () => {
      log('warn', 'Purplet library was modified. Please restart this dev process to continue receiving updates.');
      watcher.close();
    });
  }

  const gateway = new GatewayBot();

  async function reloadFeatureModule(filename: string) {
    const relativeFilename = path.relative(modulesPath, filename);
    const [features] = await Promise.all([
      moduleToFeatureArray(relativeFilename, await viteServer.ssrLoadModule(filename)),
      gateway.unloadFeaturesFromFile(relativeFilename),
    ]);
    await gateway.loadFeatures(...features);
  }

  const initModules = (await walk(modulesPath)).filter(isSourceFile);
  await asyncMap(initModules, reloadFeatureModule);
  const spinner = startSpinner('Initializing development mode...');
  await gateway.start({ mode: 'development' });
  spinner.stop();
  spinner.clear();
  log('purplet', `Bot is now running in development mode as ${gateway.user?.tag ?? 'unknown user'}`);

  let shuttingDown = false;
  process.on('SIGINT', async () => {
    if (shuttingDown) {
      return;
    }
    log('info', 'Shutting down Purplet');
    setTimeout(() => {
      log('error', 'Purplet could not shut down gracefully (waited 5 seconds). Forcing exit.');
      process.exit(1);
    }, 5000);
    await Promise.all([
      viteServer.close(),
      gateway.stop(),
    ]);
    process.exit();
  });

  hmrWatcher.on('resolvedHotUpdate', async (files: string[]) => {
    log('info', 'Reloading new changes...');
    const modulesToReload = files.filter(file => file.startsWith(modulesPath));
    await asyncMap(modulesToReload, reloadFeatureModule);
  });

  viteServer.watcher.on('unlink', filename => {
    log('info', 'Reloading new changes...');
    if (filename.startsWith(modulesPath)) {
      gateway.unloadFeaturesFromFile(path.relative(modulesPath, filename));
    }
  });

  process.on('uncaughtException', err => {
    viteServer.ssrFixStacktrace(err);
    log('error', 'Uncaught Error:');
    log('error', err);
  });

  process.on('unhandledRejection', err => {
    if (err instanceof Error) {
      viteServer.ssrFixStacktrace(err);
    }
    log('error', 'Uncaught Error (async):');
    log('error', err);
  });
}
