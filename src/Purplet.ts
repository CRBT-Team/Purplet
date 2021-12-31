import { REST } from '@discordjs/rest';
import {
  ApplicationCommandManager,
  Client,
  ClientOptions,
  GuildApplicationCommandManager,
  Intents,
} from 'discord.js';
import { Handler, HandlerInstance, isHandlerInstance } from '.';
import { Config } from './Config';

export type CommandSource = GuildApplicationCommandManager | ApplicationCommandManager;

export interface IPurplet {
  client: Client;
  rest: REST;
  handlers: Handler[];
}

/** Production purplet runtime */
export class Purplet implements IPurplet {
  client: Client;
  rest: REST;
  handlers: Handler[] = [];

  constructor(readonly config: Config) {
    const clientOptions = config.discord?.clientOptions ?? {};
    const restOptions = config.discord?.restOptions ?? {};

    this.handlers = config.handlers ?? [];

    if (!clientOptions.intents) clientOptions.intents = [];

    const extraIntents = this.handlers.map((handler) => handler.getIntents());

    clientOptions.intents = new Intents(clientOptions.intents).add(
      ...extraIntents,
      Intents.FLAGS.GUILDS
    );

    this.client = new Client(clientOptions as ClientOptions);
    this.rest = new REST({ ...restOptions, version: '9' });
  }

  public async init() {
    console.log(`Initializing Discord Bot`);

    const tokenUnresolved =
      this.config.discord?.token ??
      process.env.DISCORD_TOKEN ??
      process.env.BOT_TOKEN ??
      process.env.TOKEN;

    const token = await (typeof tokenUnresolved === 'function'
      ? tokenUnresolved()
      : tokenUnresolved);

    this.client.token = token;
    this.rest.setToken(token);

    await this.client.login();
    if (!this.client.isReady()) {
      await new Promise((resolve) => {
        this.client.once('ready', resolve);
      });
    }

    for (const handler of this.handlers) {
      await handler.init();
    }

    const guilds = this.config.discord?.commandGuilds ?? [];

    const applicationCommands = (
      await Promise.all(this.handlers.map((handler) => handler.getApplicationCommands()))
    ).flat();

    let commandSources: CommandSource[];

    if (guilds.length > 0) {
      const allGuilds = await Promise.all(guilds.map((id) => this.client.guilds.fetch(id)));
      commandSources = allGuilds.map((x) => x.commands).filter(Boolean);
      await this.client.application.commands.set([]);
    } else {
      commandSources = [this.client.application.commands];
    }

    for (const src of commandSources) {
      src.set(applicationCommands);
    }

    console.log(`Logged in as ${this.client.user.tag}`);
  }

  public registerHandler(handler: Handler) {
    if (handler.purplet) {
      throw new Error('Handler already added to a purplet.');
    }

    handler.client = this.client;
    handler.rest = this.rest;
    handler.config = this.config;
    handler.purplet = this;
    this.handlers.push(handler);
  }

  public async registerInstance(id: string, instance: HandlerInstance<unknown>) {
    let handler = this.handlers.find((h) => h.constructor === instance.handlerClass);
    if (!handler) {
      handler = new instance.handlerClass(this);
      this.registerHandler(handler);
    }
    handler.register(id, instance.data);
  }

  public async registerModule(name: string, module: Record<string, unknown>) {
    for (const [exportName, instance] of Object.entries(module)) {
      if (isHandlerInstance(instance)) {
        this.registerInstance(`${name}_${exportName}`, instance);
      }
    }
  }
}
