import entrypoint from './entrypoint.ts';
import type { Adapter } from '../../adapter';
import { purpletSourceCode } from '../../../utils/fs';

const input = `${purpletSourceCode}/${entrypoint}`;

export const gateway: Adapter = () => ({
  name: 'gateway',
  input,
  rollupConfig(config) {
    // add an external plugin:
    config.plugins.push({
      name: 'purplet-gateway-external',
      resolveId(id) {
        if (id === input) {
          return null;
        } else if (id.includes('node_modules') || id.startsWith(purpletSourceCode)) {
          return {
            id,
            external: true,
          };
        }
        return null;
      },
    });
  },
  async adapt(builder) {
    await builder.writeRollup();
  },
});
