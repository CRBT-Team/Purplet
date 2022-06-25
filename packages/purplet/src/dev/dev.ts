import * as vite from 'vite';
import path from 'path';
import { FSWatcher, watch } from 'chokidar';
import { VitePluginPurpletHMRHook } from './hmr-hook';
import { loadConfig } from '../config';
import { writeTSConfig } from '../config/tsconfig';
import { createViteConfig } from '../config/vite';
import { GatewayBot } from '../lib/gateway';
import { log, startSpinner } from '../lib/logger';
import { moduleToFeatureArray } from '../utils/feature';
import { isSourceFile } from '../utils/filetypes';
import { purpletSourceCode, walk } from '../utils/fs';
import { asyncMap } from '../utils/promise';

export interface DevOptions {
  root: string;
}

export async function startDevelopmentBot(options: DevOptions) {
  const config = await loadConfig(options.root);
  const viteConfig = await createViteConfig(config, 'development');
  await writeTSConfig(config);

  const hmrWatcher = new VitePluginPurpletHMRHook();
  viteConfig.plugins!.push(hmrWatcher);
  const viteServer = await vite.createServer(viteConfig);

  let sourceCodeWatcher: FSWatcher | undefined;
  if (purpletSourceCode.endsWith('packages/purplet/dist')) {
    // Most likely running from inside the monorepo. Maybe we want a better test for this?
    sourceCodeWatcher = watch(path.join(purpletSourceCode, '*.js')).on('change', () => {
      log(
        'warn',
        'Purplet library was modified. Please restart this dev process to continue receiving updates.'
      );
      sourceCodeWatcher?.close();
      viteServer.watcher.close();
    });
  }

  const configurationWatcher = watch(path.join(config.root, 'purplet.config.*')).on(
    'change',
    () => {
      log(
        'warn',
        'Purplet configuration was modified. Please restart this dev process to continue receiving updates.'
      );
      configurationWatcher?.close();
      viteServer.watcher.close();
    }
  );

  const gateway = new GatewayBot();
  async function reloadFeatureModule(filename: string) {
    const relativeFilename = path.relative(config.paths.features, filename);
    const [features] = await Promise.all([
      moduleToFeatureArray(relativeFilename, await viteServer.ssrLoadModule(filename)),
      gateway.unloadFeaturesFromFile(relativeFilename),
    ]);
    await gateway.loadFeatures(...features);
  }

  const initModules = (await walk(config.paths.features)).filter(isSourceFile);
  await asyncMap(initModules, reloadFeatureModule);
  const spinner = startSpinner('Initializing development mode...');
  await gateway.start({ mode: 'development' });
  spinner.stop();
  spinner.clear();
  log(
    'purplet',
    `Bot is now running in development mode as ${gateway.user?.tag ?? 'unknown user'}`
  );

  // Graceful shutdown, with a timeout to prevent the bot from hanging
  let shuttingDown = false;
  process.on('SIGINT', async () => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    log('info', 'Shutting down Purplet');
    const timer = setTimeout(() => {
      log('error', 'Purplet could not shut down gracefully (waited 5 seconds). Forcing exit.');
      process.exit(1);
    }, 5000);
    await Promise.all([
      sourceCodeWatcher?.close(),
      configurationWatcher.close(),
      viteServer.close(),
      gateway.stop(),
    ]);
    clearTimeout(timer);
  });

  // Hot Updates: Changing or adding files
  hmrWatcher.on('resolvedHotUpdate', async (files: string[]) => {
    log('info', 'Reloading new changes...');
    const modulesToReload = files.filter(file => file.startsWith(config.paths.features));
    await asyncMap(modulesToReload, reloadFeatureModule);
  });

  // Hot Updates: Removing files
  viteServer.watcher.on('unlink', filename => {
    log('info', 'Reloading new changes...');
    if (filename.startsWith(config.paths.features)) {
      gateway.unloadFeaturesFromFile(path.relative(config.paths.features, filename));
    }
  });

  // Error Handling
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
