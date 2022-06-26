import type { Immutable } from '@davecode/types';
import {
  APIChannel,
  APIChannelBase,
  ChannelType,
  RESTPatchAPIChannelJSONBody,
  Routes,
} from 'discord-api-types/v10';
import { createChannel } from '.';
import { ReadonlyChannelFlagsBitfield } from '../bit-field';
import { rest } from '../../lib/global';
import { JSONResolvable, toJSONValue } from '../../utils/plain';

/** Structure for APIChannel. */
export class Channel<Data extends APIChannelBase<ChannelType> = APIChannelBase<ChannelType>> {
  constructor(readonly raw: Immutable<Data>) {}

  async fetch() {
    return createChannel((await rest.get(Routes.channel(this.id))) as APIChannel);
  }

  // TODO: X-Audit-Log-Reason
  protected async _modify(data: JSONResolvable<RESTPatchAPIChannelJSONBody>) {
    return createChannel(
      (await rest.patch(Routes.channel(this.id), {
        body: toJSONValue(data),
      })) as APIChannel
    );
  }

  // TODO: X-Audit-Log-Reason
  async delete() {
    return rest.delete(Routes.channel(this.id));
  }

  get id() {
    return this.raw.id;
  }

  get type() {
    return this.raw.type;
  }

  get name() {
    return this.raw.name ?? null;
  }

  get flags() {
    return new ReadonlyChannelFlagsBitfield(this.raw.flags);
  }
}
