import { loadConfig } from '../config';
import { writeTSConfig } from '../config/tsconfig';
import { startSpinner } from '../lib/logger';

export interface SyncOptions {
  root: string;
}

export async function sync({ root }: SyncOptions) {
  const spinner = startSpinner('Syncing configuration...');
  const config = await loadConfig(root);
  await writeTSConfig(config);
  spinner.succeed('Synced configuration');
}
