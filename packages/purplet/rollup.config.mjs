import { createRollupConfig } from '@purplet/shared-config/rollup';
import url from '@rollup/plugin-url';
import exportDirectory from 'export-directory/rollup';

export default createRollupConfig({
  input: {
    cli: 'src/cli/_cli.ts',
    index: 'src/index.ts',
    internal: 'src/internal.ts',
    types: 'src/types.ts',
    env: 'src/env.ts',
  },
  plugins: [
    url({
      limit: 0,
      include: /\bentrypoint.ts$/,
      fileName: '[name][extname]',
    }),
    exportDirectory(),
  ],
  cjs: false,
});
