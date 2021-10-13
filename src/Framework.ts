import { Client, ClientOptions } from "discord.js";
import { Config } from "./Config";

export class Framework {
  client: Client;

  constructor(readonly config: Config) {
    const clientOptions = config.discord?.clientOptions ?? {};

    if (clientOptions.intents === undefined) {
      clientOptions.intents = [];
    }

    this.client = new Client(clientOptions as ClientOptions);
  }

  public async init() {
    const tokenUnresolved =
      this.config.discord?.token ??
      process.env.DISCORD_TOKEN ??
      process.env.BOT_TOKEN ??
      process.env.TOKEN;
    const token = await (typeof tokenUnresolved === "function"
      ? tokenUnresolved()
      : tokenUnresolved);
    await this.client.login(token);
  }

  public async addModules(modules: Record<string, Record<string, unknown>>) {
    console.log("load modules");
    console.log(modules);
  }
}
