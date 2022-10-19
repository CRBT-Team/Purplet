import { library } from '@purplet/shared-config/rollup';

export default library({
  input: {
    cli: 'src/cli/_cli.ts',
    index: 'src/index.ts',
    internal: 'src/internal.ts',
    types: 'src/types.ts',
    env: 'src/env.ts',
  },
});
