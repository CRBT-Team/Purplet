import type { APIDMChannel } from 'discord.js';
import { TextChannel } from './base-text';
import { User } from '../user';
import { createInstanceofGuard } from '../../utils/class';

export class DMChannel<Data extends APIDMChannel = APIDMChannel> extends TextChannel<Data> {
  static is = createInstanceofGuard(DMChannel);

  get user(): User {
    return new User(this.raw.recipients![0]);
  }
}

export interface DMChannel<Data extends APIDMChannel = APIDMChannel> {
  fetch(): Promise<DMChannel>;
}
