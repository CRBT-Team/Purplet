import type { Adapter } from '../../build/runtime-type';

export const runtime: Adapter = () => ({
  input: '/code/CRBT-Team/Purplet/packages/purplet/src/runtime/gateway/index.ts',
  async onBuild(builder) {
    // The runtime builder
    await builder.writeRollup(builder.getBuildDir());
  },
});
