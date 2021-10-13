import { Client, ClientOptions } from "discord.js";
import { Config } from "./Config";

export class Framework {
  client: Client;

  constructor(readonly config: Config) {
    const discordConfig = config.discordOptions ?? {};

    if (discordConfig.intents === undefined) {
      discordConfig.intents = [];
    }

    this.client = new Client(discordConfig as ClientOptions);
  }

  public async init() {
    await this.client.login(process.env.DISCORD_TOKEN ?? process.env.TOKEN);
  }

  public async addModules(modules: Record<string, Record<string, unknown>>) {
    console.log("load modules");
    console.log(modules);
  }
}
