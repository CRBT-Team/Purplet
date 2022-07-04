import { $presence, version } from 'purplet';
import { ActivityType } from 'purplet/discord-api-types';

export default $presence({
  activities: [
    {
      name: `Purplet v${version}`,
      type: ActivityType.Playing,
    },
  ],
});
