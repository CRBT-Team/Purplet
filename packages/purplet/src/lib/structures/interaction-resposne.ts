import {
  APIMessage,
  RESTGetAPIWebhookWithTokenMessageResult,
  RESTPatchAPIWebhookWithTokenMessageJSONBody,
  RESTPatchAPIWebhookWithTokenMessageResult,
  RESTPostAPIWebhookWithTokenJSONBody,
  RESTPostAPIWebhookWithTokenWaitResult,
  Routes,
} from 'discord.js';
import type { PurpletChannelInteraction } from './interaction/base-channel';
import { rest } from '../global';
import { JSONResolvable, toJSONValue } from '../../utils/plain';

// These types are overly specific. It would be interesting if a "Partial" generator could be
// made so this file would only be a couple of classes.

export class PurpletInteractionMessagePartial {
  constructor(readonly interaction: PurpletChannelInteraction, readonly id: string) {}

  async fetch() {
    const data = (await rest.get(
      Routes.webhookMessage(this.interaction.applicationId, this.interaction.id, this.id)
    )) as RESTGetAPIWebhookWithTokenMessageResult;
    return new PurpletInteractionMessage(this.interaction, data);
  }

  async edit(message: JSONResolvable<RESTPatchAPIWebhookWithTokenMessageJSONBody>) {
    // TODO: uploading files.
    const data = (await rest.patch(
      Routes.webhookMessage(this.interaction.applicationId, this.interaction.token, this.id),
      {
        body: toJSONValue(message),
        files: [],
      }
    )) as RESTPatchAPIWebhookWithTokenMessageResult;
    return data;
  }

  async delete() {
    await rest.delete(
      Routes.webhookMessage(this.interaction.applicationId, this.interaction.token, this.id)
    );
  }
}

export class PurpletInteractionMessage extends PurpletInteractionMessagePartial {
  constructor(interaction: PurpletChannelInteraction, readonly raw: APIMessage) {
    super(interaction, raw.id);
  }
}

export class PurpletOriginalInteractionMessagePartial extends PurpletInteractionMessagePartial {
  constructor(interaction: PurpletChannelInteraction, raw?: APIMessage) {
    super(interaction, '@original');
  }

  async fetch() {
    const message = await super.fetch();
    console.log(message.raw);
    return new PurpletOriginalInteractionMessage(this.interaction, message.raw);
  }

  async showFollowup(message: RESTPostAPIWebhookWithTokenJSONBody) {
    // TODO: uploading files.
    const data = (await rest.post(
      Routes.webhook(this.interaction.applicationId, this.interaction.token),
      {
        body: toJSONValue(message),
      }
    )) as RESTPostAPIWebhookWithTokenWaitResult;

    return new PurpletInteractionMessage(this.interaction, data);
  }
}

export class PurpletOriginalInteractionMessage extends PurpletInteractionMessage {
  constructor(interaction: PurpletChannelInteraction, readonly raw: APIMessage) {
    super(interaction, raw);
  }

  async showFollowup(message: RESTPostAPIWebhookWithTokenJSONBody) {
    return PurpletOriginalInteractionMessagePartial.prototype.showFollowup.call(this, message);
  }
}
