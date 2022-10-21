import path from 'path';
import { CLIError, Logger } from '@paperdave/logger';
import { Rest } from '@purplet/rest';
import type { RESTPutAPIApplicationCommandsJSONBody } from 'purplet/types';
import { pathToFileURL } from 'url';
import { errorNoToken } from './errors';
import { loadConfig } from '../config';
import { env } from '../lib/env';
import type { GatewayBot } from '../lib/GatewayBot';
import { $applicationCommands } from '../lib/hook-core';
import { mergeCommands } from '../lib/hook-core-merge';
import { runHook } from '../lib/hook-run';
import { exists } from '../utils/fs';

export interface DeployOptions {
  root: string;
  delete?: boolean;
}

export async function deploy(options: DeployOptions) {
  Logger.info(`Preparing to ${options.delete ? 'delete' : 'deploy'} commands.`);

  const config = await loadConfig(options.root);
  const token = env.DISCORD_TOKEN;

  if (!token) {
    throw errorNoToken();
  }

  let commands: RESTPutAPIApplicationCommandsJSONBody;

  if (!options.delete) {
    const buildRoot = path.resolve(options.root, config.paths.build, 'index.js');

    if (!(await exists(buildRoot))) {
      throw new CLIError(
        'Bot not built!',
        `\`purplet deploy\` requires the bot to be built first. Run \`purplet build\` first.`
      );
    }

    const buildURL = `file://${pathToFileURL(buildRoot).pathname}`;
    let bot: GatewayBot;
    try {
      bot = (await import(buildURL)).default;
    } catch (error) {
      throw new Error(`Could not import bot: ${error instanceof Error ? error.message : error}`);
    }

    commands = await runHook(bot.features, $applicationCommands, mergeCommands);

    log('info', `Found ${commands.length} (top-level) commands to deploy.`);
  } else {
    commands = [];
  }

  const rest = new Rest({ token });

  const application = await rest.oauth2.getCurrentBotApplicationInformation();
  await rest.applicationCommand.bulkOverwriteGlobalApplicationCommands({
    applicationId: application.id,
    body: commands,
  });

  Logger.success(`${options.delete ? 'Deleted' : 'Deployed'} commands successfully.`);
}
