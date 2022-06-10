import { ActivityType } from 'discord-api-types/v10';
import { $presence } from 'purplet';

export const data = $presence({
  status: 'online',
  activities: [
    {
      name: 'Purplet v2',
      type: ActivityType.Playing,
    },
  ],
});
