import type { GatewayCloseCodes } from 'purplet/types';
import { log } from './logger';

export class CLIError extends Error {
  constructor(message: string, public description?: string) {
    super(message);
  }

  printAndExit() {
    log('error', this.message);
    process.stdout.write('\x1b[1A');
    if (this.description) {
      log('none', `${this.description}\n`);
    }
    process.exit(1);
  }
}
