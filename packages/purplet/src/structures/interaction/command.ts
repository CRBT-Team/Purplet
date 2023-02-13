import type {
  APIApplicationCommandInteraction,
  APIAttachment,
  APIInteraction,
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIRole,
  Snowflake,
} from 'purplet/types';
import { InteractionType } from 'purplet/types';
import { Interaction } from './base';
import type { InteractionResponseMixin } from './response';
import { applyInteractionResponseMixins, createInteractionMixinList } from './response';
import { EmptyTextChannel } from '../channel';
import { Message } from '../message';
import { PartialUser } from '../user';
import { createInstanceofGuard } from '../../utils/class';

interface ResolvedData {
  users: PartialUser;
  roles: APIRole;
  members: APIInteractionDataResolvedGuildMember;
  channels: APIInteractionDataResolvedChannel;
  attachments: APIAttachment;
  messages: Message;
}

const structures: Record<string, any> = {
  users: PartialUser,
  roles: null,
  members: null,
  channels: null,
  attachments: null,
  messages: Message,
};

export abstract class CommandInteraction<
  Data extends APIApplicationCommandInteraction = APIApplicationCommandInteraction
> extends Interaction<Data> {
  static is = createInstanceofGuard<CommandInteraction>(CommandInteraction as any);

  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIApplicationCommandInteraction {
    return raw.type === InteractionType.ApplicationCommand;
  }

  get channel() {
    return new EmptyTextChannel({ id: this.raw.channel_id });
  }

  get commandType() {
    return this.raw.data.type;
  }

  get commandName() {
    return this.raw.data.name;
  }

  getResolved<T extends keyof ResolvedData>(type: T, id: Snowflake): ResolvedData[T] | null {
    const raw = (this.raw.data.resolved as any)[type]?.[id] ?? null;
    if (raw && structures[type]) {
      return new structures[type](raw);
    }
    return raw;
  }
}

// Mixin the response methods.
const allowedMethods = createInteractionMixinList([
  //
  'showMessage',
  'deferMessage',
  'showModal',
]);

applyInteractionResponseMixins(CommandInteraction, allowedMethods);
export type CommandInteraction = InteractionResponseMixin<typeof allowedMethods>;
