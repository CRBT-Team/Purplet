import { $intents, $presence, PresenceStatus, version } from 'purplet';
import { ActivityType, GatewayIntentBits } from 'purplet/types';

export default $presence({
  status: PresenceStatus.Online,
  activities: [
    {
      name: `Purplet v${version}`,
      type: ActivityType.Playing,
    },
  ],
});

export const x = $intents([GatewayIntentBits.MessageContent]);
