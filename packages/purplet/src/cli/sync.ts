import { Spinner } from '@paperdave/logger';
import { loadConfig } from '../config';
import { writeTSConfig } from '../config/tsconfig';

export interface SyncOptions {
  root: string;
}

export async function sync({ root }: SyncOptions) {
  const spinner = new Spinner({ text: 'Syncing configuration...' });
  const config = await loadConfig(root);
  await writeTSConfig(config);
  spinner.success('Synced configuration');
}
