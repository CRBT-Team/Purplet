import { $presence, PresenceStatus, version } from 'purplet';
import { ActivityType } from 'purplet/types';

export default $presence({
  status: PresenceStatus.Online,
  activities: [
    {
      name: `Purplet v${version}`,
      type: ActivityType.Playing,
    },
  ],
});
