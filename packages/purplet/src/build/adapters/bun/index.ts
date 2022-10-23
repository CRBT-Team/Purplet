import { copyFile } from 'fs/promises';
import entrypoint from './entrypoint.ts';
import entrypointTypes from './types.entrypoint.d.ts';
import type { Adapter } from '../../adapter';
import { pluginPurpletExternals } from '../../rollup-plugin-purplet-externals';
import { purpletSourceCode } from '../../../utils/fs';

const input = `${purpletSourceCode}/${entrypoint}`;
const types = `${purpletSourceCode}/${entrypointTypes}`;

export interface MiddlewareAdapterOptions {
  /** Default port. can be overridden at runtime with $PORT. defaults to 3000. */
  port?: number;
}

export function middleware(options: MiddlewareAdapterOptions) {
  return {
    name: 'middleware',
    input,
    options: {
      port: options.port ?? 3000,
    },
    config(e) {
      e.addRollupPlugin(pluginPurpletExternals());
    },
    async adapt(builder) {
      await builder.writeRollup();
      copyFile(types, `${builder.getBuildDir()}/index.d.ts`);
    },
  } as Adapter;
}
