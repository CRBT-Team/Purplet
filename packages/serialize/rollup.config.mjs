import { makeRollupConfig } from '@purplet/shared-config/rollup';

export default makeRollupConfig({
  input: {
    index: 'src/index.ts',
  },
});
