import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { isUnicodeSupported, Logger, logSymbols, Spinner } from '@paperdave/logger';
import { pathExists } from '@paperdave/utils';
import { buildPurpletBot } from '../build';
import { loadConfig } from '../config';

export interface BuildOptions {
  root: string;
}

export async function buildGateway(options: BuildOptions) {
  const spinner = new Spinner({ text: 'Building Purplet application' });
  const config = await loadConfig(options.root);

  // Empty build folder
  if (await pathExists(config.paths.build)) {
    await fs.rm(config.paths.build, { recursive: true });
  }
  await fs.mkdir(config.paths.build, { recursive: true });

  try {
    const { mainOutput } = await buildPurpletBot(config, spinner);
    const tada = isUnicodeSupported ? '🎉' : logSymbols.success;
    const out = './' + path.relative(process.cwd(), mainOutput);

    const text = spinner.text;
    new Logger('•', { color: 'black' })(text);
    spinner.stop(chalk.green.bold(`${tada} built to ${out}`));
  } catch (error: any) {
    spinner.error(error);
  }
}
