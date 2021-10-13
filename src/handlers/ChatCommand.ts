import {
  ApplicationCommandManager,
  CommandInteraction,
  GuildApplicationCommandManager,
  Interaction,
} from "discord.js";
import { Handler, createInstance } from "../Handler";
import { getOptionsFromBuilder } from "../util/OptionBuilder";
import { IOptionBuilder, GetOptionsFromBuilder } from "../util/OptionBuilder";

export interface ChatCommandData<O extends IOptionBuilder = IOptionBuilder> {
  name: string;
  description: string;
  options: O;
  handle: (this: CommandInteraction, options: GetOptionsFromBuilder<O>) => void;
}

export interface ChatCommandHandlerOptions {
  guilds?: string[];
}

type CommandSource = GuildApplicationCommandManager | ApplicationCommandManager;

export class ChatCommandHandler extends Handler<ChatCommandData> {
  commands = new Map<string, ChatCommandData>();
  guilds: string[];
  commandSources: CommandSource[] = [];

  constructor(readonly options: ChatCommandHandlerOptions) {
    super();

    this.guilds = this.options.guilds ?? [];
  }

  handleInteraction = (interaction: Interaction) => {
    console.log(interaction);
    if (interaction.isCommand()) {
      const cmdData = this.commands.get(interaction.commandName);
      if (cmdData) {
        const options = Object.fromEntries(
          interaction.options.data.map((opt) => [
            opt.name,
            opt.value ?? opt.user ?? opt.role ?? opt.channel,
          ])
        );
        cmdData.handle.call(interaction, options);
      }
    }
  };

  preInit(): void {
    this.client.on("interactionCreate", this.handleInteraction);
  }
  destroy(): void {
    this.client.off("interactionCreate", this.handleInteraction);
  }

  async init() {
    this.commandSources = (
      this.guilds.length
        ? (await Promise.all(this.guilds.map((guild) => this.client.guilds.fetch(guild))))
            .map((x) => x.commands)
            .filter(Boolean)
        : [this.client.application?.commands].filter(Boolean)
    ) as CommandSource[];

    if (this.guilds.length > 0) {
      await this.client.application?.commands.set([]);
    }

    for (const source of this.commandSources) {
      source.set(
        [...this.commands.values()].map((cmd) => {
          return {
            name: cmd.name,
            description: cmd.description,
            type: "CHAT_INPUT",
            options: getOptionsFromBuilder(cmd.options),
          };
        })
      );
    }
  }

  register(id: string, instance: ChatCommandData): void | Promise<void> {
    if (this.commands.has(instance.name)) {
      throw new Error(`Command ${instance.name} already exists`);
    }
    this.commands.set(instance.name, instance);
  }

  unregister(id: string, instance: ChatCommandData): void | Promise<void> {
    this.commands.delete(instance.name);
  }

  hmrReload(id: string, instance: ChatCommandData): void | Promise<void> {
    throw new Error("Method not implemented.");
  }

  hmrDestroy(id: string, instance: ChatCommandData): void | Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export function ChatCommand<O extends IOptionBuilder>(data: ChatCommandData<O>) {
  return createInstance(ChatCommandHandler, data);
}
