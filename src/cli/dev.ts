import type { Args } from '.';
import { PurpletDevelopment } from '../PurpletDevelopment';
import { loadConfig } from './load-config';

export async function dev(args: Args) {
  const config = await loadConfig(args);

  console.log('Development mode is unfinished, and does not fully work.');
  const framework = new PurpletDevelopment(config);
}
