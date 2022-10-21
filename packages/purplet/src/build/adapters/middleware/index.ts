import entrypoint from './entrypoint.ts';
import type { Adapter } from '../../adapter';
import { pluginPurpletExternals } from '../../rollup-plugin-purplet-externals';
import { purpletSourceCode } from '../../../utils/fs';

const input = `${purpletSourceCode}/${entrypoint}`;

export const gateway: Adapter = () => ({
  name: 'middleware',
  input,
  rollupConfig(config) {
    // add the external plugin:
    config.plugins.push(pluginPurpletExternals());
  },
  async adapt(builder) {
    await builder.writeRollup();
  },
});
