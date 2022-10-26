import { userMention } from '@purplet/utils';
import { IntentsString, Message } from 'discord.js';
import { getHandlerSingleton } from '..';
import { createInstance, Handler } from '../Handler';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MentionCommandMeta {}

export interface MentionCommandData {
  name: string;
  meta?: MentionCommandMeta;
  handle: (this: Message, args: string[]) => void;
}

export class MentionCommandHandler extends Handler<MentionCommandData> {
  commands = new Map<string, MentionCommandData>();

  constructor() {
    super();
  }

  handleMessage = (message: Message) => {
    const content = message.content;
    const self = message.client?.user?.id!;

    if (content.startsWith(userMention(self))) {
      const args = content.slice(userMention(self).length).trim().split(/ +/);
      const command = args.shift()!.toLowerCase();
      const cmd = this.commands.get(command);
      if (cmd) {
        cmd.handle.call(message, args);
      }
    }
  };

  init() {
    this.client.on('messageCreate', this.handleMessage);
  }

  cleanup() {
    this.client.off('messageCreate', this.handleMessage);
  }

  register(id: string, instance: MentionCommandData) {
    if (this.commands.has(instance.name)) {
      // If register() throws, the framework will handle this and print
      // a nice message about a duplicate handler instance.
      throw new Error(`Command ${instance.name} already exists`);
    }
    this.commands.set(instance.name, instance);
  }

  unregister(id: string, instance: MentionCommandData) {
    this.commands.delete(instance.name);
  }

  getIntents(): IntentsString[] {
    return ['DIRECT_MESSAGES', 'GUILD_MESSAGES'];
  }
}

export function $mentionCommand(data: MentionCommandData) {
  if (data.name.match(/ /g)) {
    throw new Error(`Command name cannot contain spaces: ${data.name}`);
  }
  return createInstance(MentionCommandHandler, data);
}

export function $getAllMentionCommands() {
  const singleton = getHandlerSingleton(MentionCommandHandler);
  if (!singleton) {
    throw new Error('MentionCommandHandler not registered');
  }

  return singleton.commands;
}
