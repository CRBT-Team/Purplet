export interface Config {}

export async function defineConfig(
  config: Config | Promise<Config> | (() => Promise<Config> | Config)
): Promise<Config> {
  if (typeof config === "function") {
    config = config();
  }
  return config;
}
