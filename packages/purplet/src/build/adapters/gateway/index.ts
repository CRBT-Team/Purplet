import entrypoint from './entrypoint.ts';
import type { Adapter } from '../../adapter';
import { pluginPurpletExternals } from '../../rollup-plugin-purplet-externals';
import { purpletSourceCode } from '../../../utils/fs';

const input = `${purpletSourceCode}/${entrypoint}`;

export function gateway(): Adapter {
  return {
    name: 'gateway',
    input,
    config(e) {
      e.addRollupPlugin(pluginPurpletExternals());
    },
    async adapt(builder) {
      await builder.writeRollup();
    },
  } as Adapter;
}
