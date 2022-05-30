import * as vite from 'vite';
import path from 'path';
import { watch } from 'chokidar';
import { createRequire } from 'module';
import { VitePluginPurpletHMRHook } from './hmr-hook';
import { moduleToFeatureArray } from '../internal';
import { GatewayBot } from '../lib/gateway';
import { isSourceFile } from '../utils/filetypes';
import { walk } from '../utils/fs';
import { asyncMap } from '../utils/promise';

const purpletSourceCode = path
  .dirname(createRequire(import.meta.url).resolve('purplet'))
  .replace(/\\/g, '/');

export interface DevOptions {
  root: string;
}

export async function startDevelopmentBot(options: DevOptions) {
  const modulesPath = path.normalize(path.join(options.root, 'src/modules'));

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
      external: ['purplet'],
    },
  });

  if (purpletSourceCode.endsWith('packages/purplet/dist')) {
    // Most likely running from inside the monorepo. Maybe we want a better test for this?
    const watcher = watch(path.join(purpletSourceCode, '*.js')).on('change', () => {
      console.log('');
      console.log('Purplet itself was rebuilt. Please restart this dev process.');
      watcher.close();
    });
  }

  const gateway = new GatewayBot({ mode: 'development' });

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
  console.log(`Loaded ${initModules.length} modules for bot start.`);
  await gateway.start();
  console.log('Watching for changes...');

  hmrWatcher.on('resolvedHotUpdate', async (files: string[]) => {
    console.log(` Hot Update Triggered`);
    const modulesToReload = files.filter(file => file.startsWith(modulesPath));

    await asyncMap(modulesToReload, reloadFeatureModule);
  });

  viteServer.watcher.on('unlink', filename => {
    console.log(`File removed: ${filename}`);
    if (filename.startsWith(modulesPath)) {
      gateway.unloadFeaturesFromFile(path.relative(modulesPath, filename));
    }
  });

  process.on('uncaughtException', err => {
    viteServer.ssrFixStacktrace(err);
    console.error('Uncaught Error:');
    console.error(err);
  });

  process.on('unhandledRejection', err => {
    if (err instanceof Error) {
      viteServer.ssrFixStacktrace(err);
    }
    console.error('Uncaught Error (async):');
    console.error(err);
  });
}
