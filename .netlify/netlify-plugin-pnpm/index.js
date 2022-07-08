module.exports = {
  onPreBuild: async ({ utils: { build, run } }) => {
    try {
      await run.command("npm install -g pnpm")
      await run.command("pnpm install --store=node_modules/.pnpm-store")
    } catch (error) {
      return build.failBuild(error)
    }
  }
}