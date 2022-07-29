import type { Immutable } from '@davecode/types';
import type { APIMessage, RESTPostAPIWebhookWithTokenJSONBody } from 'purplet/types';
import type { Interaction } from './interaction/base';
import { Message } from './message';
import type { CreateMessageData} from './resolve/create-message';
import { resolveCreateMessageData } from './resolve/create-message';
import { rest } from '../env';
import type { PartialClass } from '../utils/class';
import { createPartialClass } from '../utils/class';
import { toJSONValue } from '../utils/json';

export class InteractionMessage extends Message {
  constructor(readonly raw: Immutable<APIMessage>, readonly interaction: Interaction) {
    super(raw);
  }

  async fetch() {
    const data = await rest.interactionResponse.getFollowupMessage({
      applicationId: this.interaction.applicationId,
      interactionToken: this.interaction.token,
      messageId: this.raw.id,
    });
    return new InteractionMessage(data, this.interaction);
  }

  async edit(message: CreateMessageData) {
    const { message: body, files } = resolveCreateMessageData(message);

    const result = await rest.interactionResponse.editFollowupMessage({
      applicationId: this.interaction.applicationId,
      interactionToken: this.interaction.token,
      messageId: this.raw.id,
      body,
      files,
    });

    return new InteractionMessage(result, this.interaction);
  }

  async delete() {
    await rest.interactionResponse.deleteFollowupMessage({
      applicationId: this.interaction.applicationId,
      interactionToken: this.interaction.token,
      messageId: this.raw.id,
    });
  }
}

export type InteractionMessagePartial = PartialClass<
  typeof InteractionMessage,
  'id',
  'fetch' | 'edit' | 'delete' | 'interaction'
>;
export const InteractionMessagePartial =
  createPartialClass<InteractionMessagePartial>(InteractionMessage);

export class OriginalInteractionMessage extends InteractionMessage {
  constructor(readonly raw: Immutable<APIMessage>, interaction: Interaction) {
    super(raw, interaction);
  }

  async fetch() {
    const message = await super.fetch();
    return new OriginalInteractionMessage(message.raw, this.interaction);
  }

  async showFollowup(message: RESTPostAPIWebhookWithTokenJSONBody) {
    // TODO: uploading files.
    const data = await rest.interactionResponse.createFollowupMessage({
      applicationId: this.interaction.applicationId,
      interactionToken: this.interaction.token,
      body: toJSONValue(message),
    });
    return new InteractionMessage(data, this.interaction);
  }
}

export type OriginalInteractionMessagePartial = PartialClass<
  typeof OriginalInteractionMessage,
  'id',
  'id' | 'fetch' | 'edit' | 'delete' | 'interaction' | 'showFollowup'
>;
export const OriginalInteractionMessagePartial =
  createPartialClass<OriginalInteractionMessagePartial>(OriginalInteractionMessage);
