import { createRollupConfig } from '@purplet/shared-config/rollup';

export default createRollupConfig({
  input: 'src/index.ts',
  cli: true,
});
