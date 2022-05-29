import * as vite from 'vite';
import path from 'path';
import { VitePluginPurpletHooks } from './vite-plugin';
import { walk } from '../utils/fs';

type Module = Record<string, unknown>;

export interface DevOptions {
  root: string;
}

export async function initializeDevelopmentMode(options: DevOptions) {
  const hmrWatcher = new VitePluginPurpletHooks();

  const viteServer = await vite.createServer({
    configFile: false,
    envFile: false,
    mode: 'development',
    root: options.root,
    logLevel: 'silent',
    plugins: [hmrWatcher],
  });

  const moduleRegistry = new Map<string, Module>();

  const modulesPath = path.normalize(path.join(options.root, 'src/modules'));

  const initModules = await walk(modulesPath);
  await Promise.all(
    initModules.map(async modulePath => {
      moduleRegistry.set(modulePath, await viteServer.ssrLoadModule(modulePath));
    })
  );

  function debugPrint() {
    console.log('---');
    for (const [modulePath, module] of moduleRegistry.entries()) {
      console.log(` ${path.basename(modulePath)} : ${JSON.stringify(module)}`);
    }
    console.log('---');
  }

  console.log(`Finished Initial Load (${initModules.length} modules)`);

  debugPrint();

  hmrWatcher.on('resolvedHotUpdate', async (files: string[]) => {
    console.log(`---`);
    console.log(` Hot Update Triggered`);
    console.log(modulesPath);
    console.log(files);
    const modulesToReload = files.filter(file => file.startsWith(modulesPath));
    console.log(` Reloading ${modulesToReload.length} modules`);

    await Promise.all(
      modulesToReload.map(async modulePath => {
        const module = await viteServer.ssrLoadModule(modulePath);
        moduleRegistry.set(modulePath, module);
      })
    );

    debugPrint();
  });

  viteServer.watcher.on('unlink', filePath => {
    console.log(`File removed: ${filePath}`);
  });
}
