import { ClientOptions } from "discord.js";

export interface Config {
  /** Declare compilation options */
  compiler?: {
    /** Specify the modules path, default "./modules"  */
    modulesPath?: string;
  };
  discordOptions?: Partial<ClientOptions>;
}

export async function defineConfig(
  config: Config | (() => Promise<Config> | Config)
): Promise<Config> {
  if (typeof config === "function") {
    return config();
  }
  return config;
}
