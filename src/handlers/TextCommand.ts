import { IntentsString, Message } from 'discord.js';
import { getHandlerSingleton } from '..';
import { createInstance, Handler } from '../Handler';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TextCommandMeta {}

export interface TextCommandData {
  name: string;
  meta?: TextCommandMeta;
  handle: (this: Message, args: string[]) => void;
}

export interface TextCommandHandlerOptions {
  prefix: string | string[];
}

export class TextCommandHandler extends Handler<TextCommandData> {
  commands = new Map<string, TextCommandData>();

  constructor(public options: TextCommandHandlerOptions) {
    options.prefix = Array.isArray(options.prefix) ? options.prefix : [options.prefix];
    super();
  }

  handleMessage = (message: Message) => {
    const prefixes = this.options.prefix;
    const content = message.content;

    for (const p of prefixes) {
      if (content.startsWith(p)) {
        const args = content.slice(p.length).trim().split(/ +/);
        const command = args.shift()!.toLowerCase();
        const cmd = this.commands.get(command);
        if (cmd) {
          cmd.handle.call(message, args);
        }
      }
    }
  };

  setup() {
    this.client.on('messageCreate', this.handleMessage);
  }

  cleanup() {
    this.client.off('messageCreate', this.handleMessage);
  }

  register(id: string, instance: TextCommandData) {
    if (this.commands.has(instance.name)) {
      // If register() throws, the framework will handle this and print
      // a nice message about a duplicate handler instance.
      throw new Error(`Command ${instance.name} already exists`);
    }
    this.commands.set(instance.name, instance);
  }

  unregister(id: string, instance: TextCommandData) {
    this.commands.delete(instance.name);
  }

  getIntents(): IntentsString[] {
    return ['DIRECT_MESSAGES', 'GUILD_MESSAGES'];
  }
}

export function TextCommand(data: TextCommandData) {
  if (data.name.match(/ /g)) {
    throw new Error(`Command name cannot contain spaces: ${data.name}`);
  }
  return createInstance(TextCommandHandler, data);
}

export function getAllTextCommands() {
  const singleton = getHandlerSingleton(TextCommandHandler);
  if (!singleton) {
    throw new Error('TextCommandHandler not registered');
  }

  return singleton.commands;
}
