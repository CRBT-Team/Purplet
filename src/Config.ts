import { ClientOptions } from "discord.js";

export interface Config {
  /** compilation options */
  compiler?: {
    /** Specify the modules path, default "./modules"  */
    modulesPath?: string;
  };
  /** options related to how discord.js is used */
  discord?: {
    /** options passed to `discord.Client` */
    clientOptions?: Partial<ClientOptions>;
    /**
     * token passed to `discord.Client.login`, defaults to searching process.env for one of these variables
     *  - DISCORD_TOKEN
     *  - BOT_TOKEN
     *  - TOKEN
     * if none of these are found, an error will be thrown
     */
    token?: string | Promise<string> | (() => Promise<string> | string);
  };
}

export async function defineConfig(
  config: Config | (() => Promise<Config> | Config)
): Promise<Config> {
  if (typeof config === "function") {
    return config();
  }
  return config;
}
