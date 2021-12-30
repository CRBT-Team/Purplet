import ora from 'ora';
import type { Args } from '.';
import { PurpletDevelopment } from '../PurpletDevelopment';
import { loadConfig } from './load-config';

export async function dev(args: Args) {
  const spinner = ora('starting purplet development mode').start();

  const config = await loadConfig(args);
  const framework = new PurpletDevelopment(config);

  spinner.fail();
  console.log('not implemented, use `purplet build` instead');
}
