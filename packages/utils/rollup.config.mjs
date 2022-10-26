import { createRollupConfig } from '@purplet/shared-config/rollup';

export default createRollupConfig({
  input: {
    index: 'src/index.ts',
  },
  cjs: true,
});
