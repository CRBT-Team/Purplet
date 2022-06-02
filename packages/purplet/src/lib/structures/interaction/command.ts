import {
  APIApplicationCommandInteraction,
  APIAttachment,
  APIInteraction,
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIMessage,
  APIRole,
  APIUser,
  InteractionType,
  Snowflake,
} from 'discord.js';
import { PurpletInteraction } from './base';
import {
  applyInteractionResponseMixins,
  createInteractionMixinList,
  InteractionResponseMixin,
} from './response';

// TODO: build this type based off of what is inside of discord.js
interface ResolvedData {
  users: APIUser;
  roles: APIRole;
  members: APIInteractionDataResolvedGuildMember;
  channels: APIInteractionDataResolvedChannel;
  attachments: APIAttachment;
  messages: APIMessage;
}

export abstract class PurpletCommandInteraction<
  Data extends APIApplicationCommandInteraction = APIApplicationCommandInteraction
> extends PurpletInteraction<Data> {
  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIApplicationCommandInteraction {
    return raw.type === InteractionType.ApplicationCommand;
  }

  get commandType() {
    return this.raw.data.type;
  }

  get commandName() {
    return this.raw.data.name;
  }

  getResolved<T extends keyof ResolvedData>(type: T, id: Snowflake): ResolvedData[T] | null {
    return (this.raw.data.resolved as any)[type]?.[id] ?? null;
  }
}

// Mixin the response methods.
const allowedMethods = createInteractionMixinList([
  //
  'showMessage',
  'deferMessage',
  'showModal',
]);

applyInteractionResponseMixins(PurpletCommandInteraction, allowedMethods);
export interface PurpletCommandInteraction
  extends InteractionResponseMixin<typeof allowedMethods> {}
