import * as vite from 'vite';
import path from 'path';
import { VitePluginPurpletHooks } from './vite-plugin';
import { moduleToFeatureArray } from '../lib';
import { GatewayBot } from '../lib/gateway';
import { walk } from '../utils/fs';

export interface DevOptions {
  root: string;
}

export async function initializeDevelopmentMode(options: DevOptions) {
  const modulesPath = path.normalize(path.join(options.root, 'src/modules'));

  const hmrWatcher = new VitePluginPurpletHooks();

  const viteServer = await vite.createServer({
    configFile: false,
    envFile: false,
    mode: 'development',
    root: options.root,
    logLevel: 'silent',
    plugins: [hmrWatcher],
  });

  const gateway = new GatewayBot();

  async function reloadFeatureModule(filename: string) {
    const relativeFilename = path.relative(modulesPath, filename);
    const [features] = await Promise.all([
      moduleToFeatureArray(relativeFilename, await viteServer.ssrLoadModule(filename)),
      gateway.unloadModulesFromFile(relativeFilename),
    ]);
    await gateway.loadFeatures(...features);
  }

  const initModules = await walk(modulesPath);
  await Promise.all(initModules.map(reloadFeatureModule));
  console.log(`Loaded ${initModules.length} modules for bot start.`);
  await gateway.initialize();

  hmrWatcher.on('resolvedHotUpdate', async (files: string[]) => {
    console.log(` Hot Update Triggered`);
    const modulesToReload = files.filter(file => file.startsWith(modulesPath));

    await Promise.all(modulesToReload.map(reloadFeatureModule));
  });

  viteServer.watcher.on('unlink', filename => {
    console.log(`File removed: ${filename}`);
    if (filename.startsWith(modulesPath)) {
      gateway.unloadModulesFromFile(path.relative(modulesPath, filename));
    }
  });
}
