import type { GatewayPresenceUpdateData, PresenceUpdateStatus } from 'discord.js';
import { IntentsHookData, PresenceHookData, Status } from './hook-core';
import { IntentBitfield } from '../structures';

export function mergeIntents(intents: IntentsHookData[]) {
  return intents.map(x => IntentBitfield.resolve(x).bitfield).reduce((a, b) => a | b, 0);
}

const statusOrder = [Status.Online, Status.Idle, Status.DoNotDisturb, Status.Invisible];

export function mergePresence(presences: PresenceHookData[]): GatewayPresenceUpdateData {
  const obj: GatewayPresenceUpdateData = {
    afk: false,
    activities: [],
    since: null,
    status: Status.Online as string as PresenceUpdateStatus,
  };

  for (const entry of presences) {
    if (entry.afk) obj.afk = true;
    if (entry.activities) {
      obj.activities.push(...entry.activities);
    }
    if (entry.since) {
      obj.since = Math.max(obj.since ?? 0, entry.since);
    }
    if (
      entry.status &&
      statusOrder.indexOf(entry.status) > statusOrder.indexOf(obj.status as string as Status)
    ) {
      obj.status = entry.status as string as PresenceUpdateStatus;
    }
  }

  return obj;
}
