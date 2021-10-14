import { ApplicationCommandData, CommandInteraction, Interaction } from 'discord.js';
import { createInstance, Handler } from '../Handler';
import {
  getOptionsFromBuilder,
  GetOptionsFromBuilder,
  IOptionBuilder,
} from '../util/OptionBuilder';

export interface ChatCommandData<O extends IOptionBuilder = IOptionBuilder> {
  name: string;
  description: string;
  options: O;
  handle: (this: CommandInteraction, options: GetOptionsFromBuilder<O>) => void;
}

export class ChatCommandHandler extends Handler<ChatCommandData> {
  commands = new Map<string, ChatCommandData>();

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
