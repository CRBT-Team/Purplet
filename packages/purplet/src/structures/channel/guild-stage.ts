import type { APIVoiceChannel } from 'purplet/types';
import { GuildChannelBase } from './base-guild';
import { VoiceChannelBase } from './base-voice';
import { createInstanceofGuard } from '../../utils/class';
import { applyMixin } from '../../utils/mixin';

export class StageChannel<
  Data extends APIVoiceChannel = APIVoiceChannel
> extends VoiceChannelBase<Data> {
  static is = createInstanceofGuard(StageChannel);
}

export interface StageChannel<Data extends APIVoiceChannel = APIVoiceChannel>
  extends GuildChannelBase<Data> {
  fetch(): Promise<StageChannel>;
}

applyMixin(StageChannel, GuildChannelBase);
