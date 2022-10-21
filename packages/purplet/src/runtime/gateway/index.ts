import type { Runtime } from '../../build/runtime-type';

export const runtime: Runtime = () => ({
  input: '/code/CRBT-Team/Purplet/packages/purplet/src/runtime/gateway/index.ts',
  async onBuild(builder) {
    // The runtime builder
    await builder.writeRollup(builder.getBuildDir());
  },
});
