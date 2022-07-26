import type { ImageURLOptions } from '@discordjs/rest';
import type { APIGroupDMChannel } from 'purplet/types';
import { TextChannel } from './base-text';
import { User } from '../user';
// import { rest } from '../../lib/global';
import { createInstanceofGuard } from '../../utils/class';

type APIGroupDMChannelFixed = Omit<APIGroupDMChannel, 'name'> & { name?: string };

export class GroupDMChannel<
  Data extends APIGroupDMChannelFixed = APIGroupDMChannelFixed
> extends TextChannel<Data> {
  static is = createInstanceofGuard(GroupDMChannel);

  get applicationId() {
    return this.raw.application_id ?? null;
  }

  get recipients() {
    return this.raw.recipients!.map(user => new User(user));
  }

  get owner() {
    // TODO: check if recipients includes the client, because otherwise this will fail if the bot created the group
    return new User(this.raw.recipients!.find(user => user.id === this.raw.owner_id)!);
  }

  get iconHash() {
    return this.raw.icon ?? null;
  }

  iconURL(options: ImageURLOptions = {}) {
    return this.iconHash ? rest.cdn.channelIcon(this.id, this.iconHash, options) : null;
  }
}
