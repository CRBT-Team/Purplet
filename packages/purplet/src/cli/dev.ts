import path from 'path';
import { watch } from 'chokidar';
import { EventEmitter } from 'events';
import type { HmrContext, ModuleNode, Plugin } from 'vite';
import { createServer, ViteDevServer } from 'vite';
import defaultConfig from '../config/default';
import { loadConfig } from '../config';
import { writeTSConfig } from '../config/tsconfig';
import type { ResolvedConfig } from '../config/types';
import { createViteConfig } from '../config/vite';
import { moduleToFeatureArray } from '../internal';
import { setupEnv } from '../lib/env';
import { GatewayBot } from '../lib/gateway';
import { log, startSpinner } from '../lib/logger';
import { unique } from '../utils/array';
import { isSourceFile } from '../utils/filetypes';
import { purpletSourceCode, walk } from '../utils/fs';
import { asyncMap } from '../utils/promise';
import type { Closable } from '../utils/types';

export interface DevModeOptions {
  root: string;
}

function getImportedModules(module: ModuleNode): string[] {
  return [...module.importers]
    .flatMap(imp => getImportedModules(imp))
    .concat(module.file!)
    .filter(Boolean);
}

class VitePluginPurpletHMRHook extends EventEmitter implements Plugin {
  name = 'vite-plugin-purplet-hmr';

  handleHotUpdate(ctx: HmrContext) {
    const dependants = unique(ctx.modules.map(x => getImportedModules(x)).flat()).map(x =>
      path.normalize(x)
    );
    if (dependants.length > 0) {
      this.emit('resolvedHotUpdate', dependants);
    }
  }
}

export class DevMode {
  firstRun = true;
  config: ResolvedConfig = defaultConfig;
  viteServer!: ViteDevServer;
  bot!: GatewayBot;
  closables: Closable[] = [];

  constructor(readonly options: DevModeOptions) {}

  async start() {
    const startTime = performance.now();
    const spinner = startSpinner(
      this.firstRun ? 'Initializing development mode...' : 'Reloading...'
    );
    this.firstRun = false;

    setupEnv(true);
    this.config = await loadConfig(this.options.root);
    this.bot = new GatewayBot();

    const hmrWatcher = new VitePluginPurpletHMRHook();

    // Excuse the mess, this runs everything concurrently...
    const [initModules] = await Promise.all([
      walk(this.config.paths.features).then(list => list.filter(isSourceFile)),
      Promise.all([
        createViteConfig(this.config, 'development'),
        // TODO: HMR for alias paths starting or stopping existance must re-run writeTSConfig()
        writeTSConfig(this.config),
      ]).then(async ([viteConfig]) => {
        viteConfig.plugins!.push(hmrWatcher);
        this.viteServer = await createServer(viteConfig);
      }),
    ]);
    await asyncMap(initModules, filepath => this.reloadFeatureModule(filepath));

    this.closables.push(this.viteServer);

    this.startFeatureHMR(hmrWatcher);
    this.startUncaughtExceptionHandler();
    this.startSourceCodeWatcher();
    this.startConfigWatcher();

    await this.bot.start({
      mode: 'development',
      checkIfProductionBot: true,
      gateway: true,
    });

    spinner.stop();
    spinner.clear();
    const duration = performance.now() - startTime;
    log(
      'purplet',
      `Bot is now running in development mode as ${this.bot.user!.tag ?? 'unknown user'} (${(
        duration / 1000
      ).toFixed(1)}s)`
    );
  }

  async stop() {
    log('info', 'Shutting down Purplet');
    this.stopInternal();
  }

  private async stopInternal() {
    await asyncMap(this.closables, closable => closable.close());
    this.closables = [];
  }

  private startFeatureHMR(hmrWatcher: VitePluginPurpletHMRHook) {
    //  Hot Updates: Changing or adding files
    hmrWatcher.on('resolvedHotUpdate', async (files: string[]) => {
      log('info', 'Reloading new changes...');
      const modulesToReload = files.filter(file => file.startsWith(this.config.paths.features));
      await asyncMap(modulesToReload, mod => this.reloadFeatureModule(mod));
    });

    // Hot Updates: Removing files
    this.viteServer.watcher.on('unlink', filename => {
      log('info', 'Reloading new changes...');
      if (filename.startsWith(this.config.paths.features)) {
        this.bot.unloadFeaturesFromFile(path.relative(this.config.paths.features, filename));
      }
    });
  }

  private startUncaughtExceptionHandler() {
    const handler = (err: unknown) => {
      if (err instanceof Error) {
        this.viteServer.ssrFixStacktrace(err);
      }
      log('error', 'Uncaught Error (async):');
      log('error', err);
    };

    process.on('uncaughtException', handler);
    process.on('unhandledRejection', handler);

    this.closables.push({
      close() {
        process.off('uncaughtException', handler);
        process.off('unhandledRejection', handler);
      },
    });
  }

  private startSourceCodeWatcher() {
    if (purpletSourceCode.endsWith('packages/purplet/dist')) {
      // Most likely running from inside the monorepo. Maybe we want a better test for this?
      const watcher = watch(path.join(purpletSourceCode, '*.js')).on('change', () => {
        log(
          'warn',
          'Purplet library was modified. Please restart this dev process to continue receiving updates.'
        );
        this.viteServer.watcher.close();
        watcher.close();
      });
      this.closables.push(watcher);
    }
  }

  private startConfigWatcher() {
    const watcher = watch(path.join(this.options.root, 'purplet.config.*')).on(
      'change',
      async filepath => {
        log('info', path.basename(filepath) + ' was modified. Restarting development mode.');
        await this.stopInternal();
        await this.start();
      }
    );
    this.closables.push(watcher);
  }

  private async reloadFeatureModule(filename: string) {
    const relativeFilename = path.relative(this.config.paths.features, filename);

    const [features] = await Promise.all([
      moduleToFeatureArray(relativeFilename, await this.viteServer.ssrLoadModule(filename)),
      this.bot.unloadFeaturesFromFile(relativeFilename),
    ]);
    await this.bot.loadFeatures(...features);
  }
}
