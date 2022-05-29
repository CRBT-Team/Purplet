import path from 'path';
import { EventEmitter } from 'events';
import { HmrContext, ModuleNode, Plugin } from 'vite';
import { unique } from '../utils/array';

function getImportedModules(module: ModuleNode): string[] {
  return [...module.importers]
    .flatMap(imp => getImportedModules(imp))
    .concat(module.file!)
    .filter(Boolean);
}

export class VitePluginPurpletHooks extends EventEmitter implements Plugin {
  name = 'vite-plugin-purplet-hooks';

  async handleHotUpdate(ctx: HmrContext) {
    const dependants = unique(ctx.modules.map(x => getImportedModules(x)).flat()).map(x =>
      path.normalize(x)
    );
    if (dependants.length > 0) {
      this.emit('resolvedHotUpdate', dependants);
    }
  }
}
