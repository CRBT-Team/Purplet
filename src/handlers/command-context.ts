import {
  Awaitable,
  ContextMenuInteraction,
  Interaction,
  Message,
  TextChannel,
  User,
} from 'discord.js';
import { createInstance, PurpletApplicationCommandData } from '..';
import { Handler } from '../Handler';

interface ContextMenuTypes {
  MESSAGE: Message;
  USER: User;
}

export interface ContextCommandData<T extends keyof ContextMenuTypes = keyof ContextMenuTypes> {
  type: T;
  name: string;
  handle(this: ContextMenuInteraction, item: ContextMenuTypes[T]): void;
}

export type ContextCommandShorthandData<T extends keyof ContextMenuTypes> = Omit<
  ContextCommandData<T>,
  'type'
>;

type TargetFetchersMap = {
  [K in keyof ContextMenuTypes]: (i: ContextMenuInteraction) => Awaitable<ContextMenuTypes[K]>;
};

const targetFetchers: TargetFetchersMap = {
  async MESSAGE(i) {
    const messageId = i.targetId;
    const guild = await i.client.guilds.fetch(i.guildId!);
    const channel = (await guild!.channels.fetch(i.channelId!)) as TextChannel;
    const message = await channel!.messages.fetch(messageId);
    return message!;
  },
  async USER(i) {
    const userId = i.targetId;
    const user = await i.client.users.fetch(userId);
    return user!;
  },
};

export class ContextCommandHandler extends Handler<ContextCommandData> {
  commands = new Map<string, ContextCommandData>();

  handleInteraction = async (interaction: Interaction) => {
    if (!interaction.isContextMenu()) return;

    const type = interaction.targetType;
    const name = interaction.commandName;
    const command = this.commands.get(`${type}:${name}`);

    if (!command) return;

    const target = await targetFetchers[type](interaction);

    command.handle.call(interaction, target);
  };

  init(): void | Promise<void> {
    this.client.on('interactionCreate', this.handleInteraction);
  }

  cleanup(): void {
    this.client.off('interactionCreate', this.handleInteraction);
  }

  register(id: string, instance: ContextCommandData) {
    const key = `${instance.type}:${instance.name}`;
    if (this.commands.has(key)) {
      throw new Error(
        `Context Menu command "${instance.name}" for "${instance.type}" already exists`
      );
    }
    this.commands.set(key, instance);
  }

  unregister(id: string, instance: ContextCommandData) {
    const key = `${instance.type}:${instance.name}`;
    this.commands.delete(key);
  }

  getApplicationCommands(): PurpletApplicationCommandData[] {
    return [...this.commands.values()].map((command) => ({
      name: command.name,
      description: '',
      type: command.type,
    }));
  }
}

export function $contextCommand(data: ContextCommandData) {
  return createInstance(ContextCommandHandler, data);
}

export function $userContextCommand(data: ContextCommandShorthandData<'USER'>) {
  return $contextCommand({
    type: 'USER',
    ...data,
  });
}

export function $messageContextCommand(data: ContextCommandShorthandData<'MESSAGE'>) {
  return $contextCommand({
    type: 'MESSAGE',
    ...data,
  });
}
