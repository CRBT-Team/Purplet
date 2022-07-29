import type { APIVoiceChannel } from 'purplet/types';
import { VideoQualityMode } from 'purplet/types';
import { Channel } from './base';

export class VoiceChannelBase<
  Data extends APIVoiceChannel = APIVoiceChannel
> extends Channel<Data> {
  get bitrate() {
    return this.raw.bitrate!;
  }

  get userLimit() {
    return this.raw.user_limit!;
  }

  get region() {
    return this.raw.rtc_region ?? null;
  }

  get videoQualityMode() {
    return this.raw.video_quality_mode ?? VideoQualityMode.Auto;
  }
}

export interface VoiceChannelBase {
  fetch(): Promise<VoiceChannelBase>;
}
