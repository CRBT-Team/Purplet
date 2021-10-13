import { RESTOptions } from "@discordjs/rest";
import { ClientOptions } from "discord.js";
import { RecursivePartial } from "./util/types";
import { BuildOptions } from "esbuild";
import { Handler } from ".";
import { ResolvesTo } from "./util/resolvesTo";

export interface Config {
  /** compilation options */
  compiler: {
    /** Specify the modules path, default "./modules"  */
    modulesPath: string;
    /** Specify the handlers path, default "./handlers"  */
    handlersPath: string;
    /** Specify the output path, default "./dist/bot.mjs" */
    outputPath: string;
    /** Specify aliases */
    alias: {
      [key: string]: string;
    };
    /** Specify esbuild plugins */
    esbuildPlugins: BuildOptions["plugins"];
    /** Specify esbuild options */
    esbuildOptions: Omit<BuildOptions, "bundle" | "outdir" | "entryPoints" | "watch" | "plugins">;
  };
  /** options related to how discord.js is used */
  discord: {
    /** options passed to `discord.js` */
    clientOptions: ClientOptions;
    /** options passed to `@discordjs/rest` */
    restOptions: RESTOptions;
    /**
     * token passed to `discord.Client.login`, defaults to searching process.env for one of these variables
     *  - DISCORD_TOKEN
     *  - BOT_TOKEN
     *  - TOKEN
     * if none of these are found, an error will be thrown
     */
    token: ResolvesTo<string>;
  };
  /** options related to different handler types */
  handlers: Handler<any>[];
}

export type PartialConfig = RecursivePartial<Config>;

export async function defineConfig(config: ResolvesTo<PartialConfig>): Promise<PartialConfig> {
  if (typeof config === "function") {
    return config();
  }
  return config;
}
