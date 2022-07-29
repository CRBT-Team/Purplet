import type { Immutable } from '@paperdave/utils';
import type { APIChannelBase, ChannelType, RESTPatchAPIChannelJSONBody } from 'purplet/types';
import { createChannel } from './create';
import { ReadonlyChannelFlagsBitfield } from '../bit-field';
import { rest } from '../../env';
import type { JSONResolvable } from '../../utils/json';
import { toJSONValue } from '../../utils/json';

/** Structure for APIChannel. */
export class Channel<Data extends APIChannelBase<ChannelType> = APIChannelBase<ChannelType>> {
  constructor(readonly raw: Immutable<Data>) {}

  async fetch() {
    return createChannel(await rest.channel.getChannel({ channelId: this.id }));
  }

  // TODO: X-Audit-Log-Reason
  protected async _modify(data: JSONResolvable<RESTPatchAPIChannelJSONBody>) {
    return createChannel(
      await rest.channel.modifyChannel({
        channelId: this.id,
        body: toJSONValue(data),
      })
    );
  }

  // TODO: X-Audit-Log-Reason
  async delete() {
    await rest.channel.deleteOrCloseChannel({ channelId: this.id });
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
