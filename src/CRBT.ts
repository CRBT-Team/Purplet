import type { Client } from "discord.js";
import { CRBTErr } from "./Utils/console";

interface IConfig {
  commandsDir: string;

  // Non-application commands
  prefixes?: string | string[];
  owners?: string | string[];
}

export class CRBT {
  public commandsDir: string = "commands";

  public prefixes?: string[];
  public owners: string[] = [];

  constructor(client: Client, config: IConfig) {
    if (!client) throw new CRBTErr(`Please provide your Discord.JS client!`);
    if (!config) throw new CRBTErr(`Please provide a configuration object!`);

    const { commandsDir, prefixes, owners } = config;

    if (!commandsDir) throw new CRBTErr(`Please provide a commandsDir`);
    this.commandsDir = commandsDir;

    if (prefixes)
      this.prefixes = Array.isArray(prefixes) ? prefixes : [prefixes];

    if (owners) {
      this.owners = Array.isArray(owners) ? owners : [owners];
      // this.addBotOwner(client);
      for(const owner of this.owners) {
        try {
          client.users.fetch(owner)
        } catch {
          throw new CRBTErr(`The user ID ${owner} cannot be seen by the client. Please remove this ID.`)
        }
      }
    }
  }

  // private async addBotOwner(client: Client) {
  //   this.owners.push((await client.application?.fetch())?.owner?.id as string);
  // }
}
