import { ActivitiesOptions, Awaitable, PresenceData } from 'discord.js';
import { createInstance, IPurplet } from '..';
import { Handler } from '../Handler';

export interface PresenceProviderData {
  interval?: number;
  getPresence(this: IPurplet): Awaitable<PresenceData>;
}

export interface ActivityProviderData {
  interval?: number;
  getActivity(this: IPurplet): Awaitable<ActivitiesOptions>;
}

const statusPriority = ['online', 'idle', 'dnd', 'invisible', 'offline'];

export function mergePresences(...presences: PresenceData[]): PresenceData {
  return presences.reduce(
    (acc, p) => {
      if (p.status) {
        acc.status =
          statusPriority.indexOf(p.status) > statusPriority.indexOf(acc.status!)
            ? p.status
            : acc.status;
      }
      if (p.activities) {
        acc.activities!.push(...p.activities);
      }
      if (p.afk) {
        acc.afk = true;
      }
      return acc;
    },
    {
      activities: [],
      afk: false,
      status: 'online',
    }
  );
}

export class PresenceProviderHandler extends Handler<PresenceProviderData> {
  running = false;

  providers = new Map<string, PresenceProviderData>();
  lastRecalculation = new Map<string, number>();
  providedPresences = new Map<string, PresenceData>();

  calculateAllPresences = async () => {
    const promises = [];
    for (const [id, instance] of this.providers) {
      if (
        !this.providedPresences.has(id) ||
        (this.lastRecalculation.get(id) ?? 0) + instance.interval! < Date.now()
      ) {
        promises.push(this.calculatePresence(id));
      }
    }
    await Promise.all(promises);
    if (promises.length > 0) {
      this.applyPresence();
    }
  };

  interval: NodeJS.Timer | null = null;

  async init() {
    this.running = true;
    await this.calculateAllPresences();
    this.interval = setInterval(this.calculateAllPresences, 1000 * 30);
  }

  cleanup() {
    this.running = false;
    this.providedPresences.clear();
    this.lastRecalculation.clear();
  }

  async calculatePresence(id: string) {
    const instance = this.providers.get(id);
    if (!instance) return;
    const presence = await instance.getPresence.call(this.purplet);
    this.providedPresences.set(id, presence);
    this.lastRecalculation.set(id, Date.now());
  }

  applyPresence() {
    const presences = mergePresences(...this.providedPresences.values());
    this.purplet.client.user?.setPresence(presences);
  }

  register(id: string, instance: PresenceProviderData) {
    this.providers.set(id, instance);
    this.lastRecalculation.set(id, Date.now());
    if (this.running) {
      this.calculatePresence(id);
      this.applyPresence();
    }
  }

  unregister(id: string) {
    this.providers.delete(id);
    this.lastRecalculation.delete(id);
    this.providedPresences.delete(id);
  }
}

export function PresenceProvider(data: PresenceProviderData) {
  return createInstance(PresenceProviderHandler, {
    ...data,
    interval: data.interval ?? 1000 * 60 * 5,
  });
}

export function ActivityProvider(data: ActivityProviderData) {
  return PresenceProvider({
    interval: data.interval,
    async getPresence() {
      return {
        activities: [await data.getActivity.call(this)],
      };
    },
  });
}
