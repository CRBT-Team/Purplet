import { Client, ClientOptions, Intents } from "discord.js";
import { REST } from "@discordjs/rest";
import { Handler, IPurplet } from ".";
import { Config } from "./Config";

export class PurpletDevelopment implements IPurplet {
  client: Client;
  rest: REST;
  handlers: Handler[] = [];

  constructor(readonly config: Config) {
    const clientOptions = config.discord?.clientOptions ?? {};
    const restOptions = config.discord?.restOptions ?? {};

    if (clientOptions.intents === undefined) {
      clientOptions.intents = [Intents.FLAGS.GUILDS];
    }

    this.client = new Client(clientOptions as ClientOptions);
    this.rest = new REST({ ...restOptions, version: "9" });
  }
}
