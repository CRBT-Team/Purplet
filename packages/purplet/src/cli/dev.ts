import path from 'path';
import { asyncMap, unique } from '@davecode/utils';
import { watch } from 'chokidar';
import { EventEmitter } from 'events';
import type { HmrContext, ModuleNode, Plugin } from 'vite';
import { createServer, ViteDevServer } from 'vite';
import defaultConfig from '../config/default';
import { errorNoIncludeAndExcludeGuilds, errorNoToken } from './errors';
import { loadConfig } from '../config';
import { writeTSConfig } from '../config/tsconfig';
import type { ResolvedConfig } from '../config/types';
import { createViteConfig } from '../config/vite';
import { moduleToFeatureArray } from '../internal';
import { env, setGlobalEnv } from '../lib/env';
import { GatewayBot } from '../lib/GatewayBot';
import type { Feature } from '../lib/hook';
import { log, startSpinner } from '../lib/logger';
import { isSourceFile } from '../utils/filetypes';
import { purpletSourceCode, walk } from '../utils/fs';
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
  featureMap: Map<string, Feature[]> = new Map();

  constructor(readonly options: DevModeOptions) {}

  async start() {
    const spinner = startSpinner(
      this.firstRun ? 'Initializing development mode...' : 'Reloading...'
    );
    this.firstRun = false;

    this.config = await loadConfig(this.options.root);

    setGlobalEnv({
      config: this.config,
    });

    const token = env.DISCORD_BOT_TOKEN;

    if (!token) {
      throw errorNoToken();
    }

    const include = env.PURPLET_INCLUDE_GUILDS ?? '';
    const exclude = env.PURPLET_EXCLUDE_GUILDS ?? '';

    if (include && exclude) {
      throw errorNoIncludeAndExcludeGuilds();
    }

    this.bot = new GatewayBot({
      token,
      deployGuildCommands: true,
      guildRules: {
        include: include ? include.split(',') : [],
        exclude: exclude ? exclude.split(',') : [],
      },
    });

    const hmrWatcher = new VitePluginPurpletHMRHook();

    // Excuse the mess, this runs a lot of init stuff concurrently, but they all resolve nearly
    // instantly so it's not like it matters much.
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

    await this.bot.start();

    spinner.stop();
    spinner.clear();
    const startupTime = (performance.now() / 1000).toFixed(1);
    log(
      'purplet',
      `Bot is now running in development mode as ${this.bot.user.tag} (${startupTime}s)`
    );
  }

  async stop() {
    log('info', 'Shutting down Purplet');
    await this.stopInternal();
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
    this.viteServer.watcher.on('unlink', async filename => {
      log('info', 'Reloading new changes...');
      if (filename.startsWith(this.config.paths.features) && this.featureMap.has(filename)) {
        await this.bot.patchFeatures({
          add: [],
          remove: this.featureMap.get(filename)!,
        });
        this.featureMap.delete(filename);
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
    ]);
    await this.bot.patchFeatures({
      add: features,
      remove: this.featureMap.get(filename) ?? [],
    });
    this.featureMap.set(filename, features);
  }
}
