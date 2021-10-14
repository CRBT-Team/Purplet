import { RESTOptions } from '@discordjs/rest';
import { ClientOptions } from 'discord.js';
import { BuildOptions } from 'esbuild';
import { Handler } from './Handler';
import { Resolvable } from './util/resolvable';
import { RecursivePartial } from './util/types';

export interface Config {
  /** Compilation options */
  compiler: {
    /** Specify the modules path, default "./modules" */
    modulesPath: string;
    /** Specify the output path, default "./dist/bot.mjs" */
    outputPath: string;
    /** Specify aliases */
    alias: {
      [key: string]: string;
    };
    /** Specify esbuild plugins */
    esbuildPlugins: BuildOptions['plugins'];
    /** Specify esbuild options */
    esbuildOptions: Omit<BuildOptions, 'bundle' | 'outdir' | 'entryPoints' | 'watch' | 'plugins'>;
  };
  /** Options related to how discord.js is used */
  discord: {
    /** Options passed to `discord.js` */
    clientOptions: ClientOptions;
    /** Options passed to `@discordjs/rest` */
    restOptions: RESTOptions;
    /**
     * List of guilds to post application commands to. if an empty array, posts commands to the
     * global application. In development mode, having global app commands is not allowed.
     */
    commandGuilds: string[];
    /**
     * Token passed to `discord.Client.login`, defaults to searching process.env for one of these variables
     *
     * - DISCORD_TOKEN
     * - BOT_TOKEN
     * - TOKEN if none of these are found, an error will be thrown
     */
    token: Resolvable<string>;
  };
  /** Options related to different handler types */
  handlers: Handler[];
}

export type PartialConfig = RecursivePartial<Config>;

export async function defineConfig(config: Resolvable<PartialConfig>): Promise<PartialConfig> {
  if (typeof config === 'function') {
    return config();
  }
  return config;
}
