import type { Immutable } from '@davecode/types';
import {
  APIMessage,
  RESTGetAPIWebhookWithTokenMessageResult,
  RESTPatchAPIWebhookWithTokenMessageResult,
  RESTPostAPIWebhookWithTokenJSONBody,
  RESTPostAPIWebhookWithTokenWaitResult,
  Routes,
} from 'purplet/types';
import type { Interaction } from './interaction/base';
import { Message } from './message';
import { CreateMessageData, resolveCreateMessageData } from './resolve/create-message';
import { rest } from '../lib/global';
import { createPartialClass, PartialClass } from '../utils/class';
import { toJSONValue } from '../utils/json';

export class InteractionMessage extends Message {
  constructor(readonly raw: Immutable<APIMessage>, readonly interaction: Interaction) {
    super(raw);
  }

  async fetch() {
    const data = (await rest.get(
      Routes.webhookMessage(this.interaction.applicationId, this.interaction.token, this.raw.id)
    )) as RESTGetAPIWebhookWithTokenMessageResult;
    return new InteractionMessage(data, this.interaction);
  }

  async edit(message: CreateMessageData) {
    const { message: body, files } = resolveCreateMessageData(message);

    const result = (await rest.patch(
      Routes.webhookMessage(this.interaction.applicationId, this.interaction.token, this.raw.id),
      {
        body,
        files,
      }
    )) as RESTPatchAPIWebhookWithTokenMessageResult;

    return new InteractionMessage(result, this.interaction);
  }

  async delete() {
    await rest.delete(
      Routes.webhookMessage(this.interaction.applicationId, this.interaction.token, this.raw.id)
    );
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
    const data = (await rest.post(
      Routes.webhook(this.interaction.applicationId, this.interaction.token),
      {
        body: toJSONValue(message),
      }
    )) as RESTPostAPIWebhookWithTokenWaitResult;

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
