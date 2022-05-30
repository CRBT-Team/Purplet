import * as vite from 'vite';
import path from 'path';
import { VitePluginPurpletHMRHook } from './hmr-hook';
import { moduleToFeatureArray } from '../internal';
import { GatewayBot } from '../lib/gateway';
import { isSourceFile } from '../utils/filetypes';
import { walk } from '../utils/fs';

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
  });

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
  await Promise.all(initModules.map(reloadFeatureModule));
  console.log(`Loaded ${initModules.length} modules for bot start.`);
  await gateway.start();

  hmrWatcher.on('resolvedHotUpdate', async (files: string[]) => {
    console.log(` Hot Update Triggered`);
    const modulesToReload = files.filter(file => file.startsWith(modulesPath));

    await Promise.all(modulesToReload.map(reloadFeatureModule));
  });

  viteServer.watcher.on('unlink', filename => {
    console.log(`File removed: ${filename}`);
    if (filename.startsWith(modulesPath)) {
      gateway.unloadFeaturesFromFile(path.relative(modulesPath, filename));
    }
  });
}
