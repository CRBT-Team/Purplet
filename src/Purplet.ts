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
  running = false;

  client: Client;
  rest: REST;
  handlers: Handler[] = [];
  preRegisteredHandlers: Handler[] = [];

  constructor(readonly config: Config) {
    const clientOptions = config.discord?.clientOptions ?? {};
    const restOptions = config.discord?.restOptions ?? {};

    if (!clientOptions.intents) clientOptions.intents = [];

    this.client = new Client(clientOptions as ClientOptions);
    this.rest = new REST({ ...restOptions, version: '9' });

    this.preRegisteredHandlers = config.handlers.concat();
  }

  public async init() {
    console.log(`Initializing Discord Bot`);

    await Promise.all(this.config.handlers.map((handler) => this.registerHandler(handler)));

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

    const extraIntents = this.handlers.map((handler) => handler.getIntents());

    this.client.options.intents = new Intents(this.client.options.intents).add(
      ...extraIntents,
      Intents.FLAGS.GUILDS
    );

    await this.client.login();
    if (!this.client.isReady()) {
      await new Promise((resolve) => {
        this.client.once('ready', resolve);
      });
    }

    const guilds = (this.config.discord?.commandGuilds ?? []).concat(
      (process.env.PURPLET_COMMAND_GUILDS ?? '').split(',').filter(Boolean)
    );

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

  public async registerHandler(handler: Handler) {
    if (handler.purplet) {
      throw new Error('Handler already added to a purplet.');
    }

    this.preRegisteredHandlers.push(handler);
    handler.client = this.client;
    handler.rest = this.rest;
    handler.config = this.config;
    handler.purplet = this;
    await handler.init();
    this.handlers.push(handler);
  }

  public async registerInstance(id: string, instance: HandlerInstance<unknown>) {
    let handler = this.preRegisteredHandlers.find((h) => h.constructor === instance.handlerClass);
    if (!handler) {
      handler = new instance.handlerClass();
      await this.registerHandler(handler);
    }
    handler.register(id, instance.data);
  }

  public async registerModule(name: string, module: Record<string, unknown>) {
    for (const [exportName, instance] of Object.entries(module)) {
      if (isHandlerInstance(instance)) {
        await this.registerInstance(`${name}_${exportName}`, instance);
      }
    }
  }
}
