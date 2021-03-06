import type { APIGuildForumChannel } from 'purplet/types';
import { GuildTextChannel } from './guild-text';
import { createInstanceofGuard } from '../../utils/class';

/** UNDOCUMENTED. */
export class ForumChannel<
  Data extends APIGuildForumChannel = APIGuildForumChannel
> extends GuildTextChannel<Data> {
  static is = createInstanceofGuard(ForumChannel);
}
