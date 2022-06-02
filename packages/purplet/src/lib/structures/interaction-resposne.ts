import {
  APIMessage,
  RESTGetAPIWebhookWithTokenMessageResult,
  RESTPatchAPIWebhookWithTokenMessageJSONBody,
  RESTPatchAPIWebhookWithTokenMessageResult,
  RESTPostAPIWebhookWithTokenJSONBody,
  RESTPostAPIWebhookWithTokenWaitResult,
  Routes,
} from 'discord.js';
import type { PurpletInteraction } from './interaction/base';
import { PurpletMessage } from './message';
import { rest } from '../global';
import { createPartialClass, PartialClass } from '../../utils/partial';
import { JSONResolvable, toJSONValue } from '../../utils/plain';

export class PurpletInteractionMessage extends PurpletMessage {
  constructor(raw: APIMessage, readonly interaction: PurpletInteraction) {
    super(raw);
  }

  async fetch() {
    const data = (await rest.get(
      Routes.webhookMessage(this.interaction.applicationId, this.interaction.token, this.raw.id)
    )) as RESTGetAPIWebhookWithTokenMessageResult;
    return new PurpletInteractionMessage(data, this.interaction);
  }

  async edit(message: JSONResolvable<RESTPatchAPIWebhookWithTokenMessageJSONBody>) {
    // TODO: uploading files.
    const data = (await rest.patch(
      Routes.webhookMessage(this.interaction.applicationId, this.interaction.token, this.raw.id),
      {
        body: toJSONValue(message),
        files: [],
      }
    )) as RESTPatchAPIWebhookWithTokenMessageResult;
    return data;
  }

  async delete() {
    await rest.delete(
      Routes.webhookMessage(this.interaction.applicationId, this.interaction.token, this.raw.id)
    );
  }
}

export type PurpletInteractionMessagePartial = PartialClass<
  typeof PurpletInteractionMessage,
  'id',
  'fetch' | 'edit' | 'delete' | 'interaction'
>;
export const PurpletInteractionMessagePartial =
  createPartialClass<PurpletInteractionMessagePartial>(PurpletInteractionMessage);

export class PurpletOriginalInteractionMessage extends PurpletInteractionMessage {
  constructor(raw: APIMessage, interaction: PurpletInteraction) {
    super(raw, interaction);
  }

  async fetch() {
    const message = await super.fetch();
    return new PurpletOriginalInteractionMessage(message.raw, this.interaction);
  }

  async showFollowup(message: RESTPostAPIWebhookWithTokenJSONBody) {
    // TODO: uploading files.
    const data = (await rest.post(
      Routes.webhook(this.interaction.applicationId, this.interaction.token),
      {
        body: toJSONValue(message),
      }
    )) as RESTPostAPIWebhookWithTokenWaitResult;

    return new PurpletInteractionMessage(data, this.interaction);
  }
}

export type PurpletOriginalInteractionMessagePartial = PartialClass<
  typeof PurpletOriginalInteractionMessage,
  'id',
  'fetch' | 'edit' | 'delete' | 'interaction' | 'showFollowup'
>;
export const PurpletOriginalInteractionMessagePartial =
  createPartialClass<PurpletInteractionMessagePartial>(PurpletOriginalInteractionMessage);
