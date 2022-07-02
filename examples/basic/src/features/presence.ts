import { ActivityType, PresenceUpdateStatus } from 'discord.js';
import { $presence } from 'purplet';

export default $presence({
  status: PresenceUpdateStatus.Online,
  activities: [
    {
      name: 'Purplet v2',
      type: ActivityType.Playing,
    },
  ],
  since: null,
  afk: false,
});
