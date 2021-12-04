import {
  ApplicationCommandData,
  Client,
  CommandInteraction,
  CommandInteractionOption,
  Guild,
  Interaction,
} from 'discord.js';
import { createInstance, Handler } from '../Handler';
import {
  getOptionsFromBuilder,
  GetOptionsFromBuilder,
  IOptionBuilder,
} from '../util/OptionBuilder';

export interface ChatCommandData<O extends IOptionBuilder = IOptionBuilder> {
  name: string;
  description: string;
  options?: O;
  handle: (this: CommandInteraction, options: GetOptionsFromBuilder<O>) => void;
}

async function resolveOptionValue(
  client: Client,
  guild: Guild | null,
  opt: CommandInteractionOption
) {
  const value = opt.value;
  if (typeof value === 'string') {
    switch (opt.type) {
      case 'CHANNEL':
        return client.channels.resolve(value);
      case 'USER':
        return client.users.resolve(value);
      case 'ROLE':
        return guild?.roles.resolve(value);
      case 'MENTIONABLE':
        return client.users.resolve(value) || guild?.roles.resolve(value);
      default:
        return opt.value;
    }
  }
  return opt.value;
}

export class ChatCommandHandler extends Handler<ChatCommandData> {
  commands = new Map<string, ChatCommandData>();

  handleInteraction = async (interaction: Interaction) => {
    if (interaction.isCommand()) {
      const cmdData = this.commands.get(interaction.commandName);
      if (cmdData) {
        const options = Object.fromEntries(
          await Promise.all(
            interaction.options.data.map(async (opt) => [
              opt.name,
              await resolveOptionValue(this.client, interaction.guild, opt),
            ])
          )
        );
        cmdData.handle.call(interaction, options);
      }
    }
  };

  setup() {
    this.client.on('interactionCreate', this.handleInteraction);
  }

  cleanup() {
    this.client.off('interactionCreate', this.handleInteraction);
  }

  register(id: string, instance: ChatCommandData) {
    if (this.commands.has(instance.name)) {
      // If register() throws, the framework will handle this and print
      // a nice message about a duplicate handler instance.
      throw new Error(`Command ${instance.name} already exists`);
    }
    this.commands.set(instance.name, instance);
  }

  unregister(id: string, instance: ChatCommandData) {
    this.commands.delete(instance.name);
  }

  getApplicationCommands(): ApplicationCommandData[] {
    return [...this.commands.values()].map((cmd) => {
      return {
        name: cmd.name,
        description: cmd.description,
        type: 'CHAT_INPUT',
        options: getOptionsFromBuilder(cmd.options),
      };
    });
  }
}

export function ChatCommand<O extends IOptionBuilder>(data: ChatCommandData<O>) {
  return createInstance(ChatCommandHandler, data);
}
