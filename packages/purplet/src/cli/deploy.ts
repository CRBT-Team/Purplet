import path from 'path';
import { REST } from '@discordjs/rest';
import {
  RESTGetAPIOAuth2CurrentApplicationResult,
  RESTPutAPIApplicationCommandsJSONBody,
  Routes,
} from 'purplet/types';
import { pathToFileURL } from 'url';
import { errorNoToken } from './errors';
import { loadConfig } from '../config';
import { getEnvVar, setupEnv } from '../lib/env';
import { CLIError } from '../lib/errors';
import type { GatewayBot } from '../lib/GatewayBot';
import { $applicationCommands } from '../lib/hook-core';
import { mergeCommands } from '../lib/hook-core-merge';
import { runHook } from '../lib/hook-run';
import type { HTTPBot } from '../lib/HTTPBot';
import { log } from '../lib/logger';
import { exists } from '../utils/fs';

export interface DeployOptions {
  root: string;
  delete?: boolean;
}

export async function deploy(options: DeployOptions) {
  setupEnv(false);
  log('info', `Preparing to ${options.delete ? 'delete' : 'deploy'} commands.`);

  const config = await loadConfig(options.root);
  const token = getEnvVar('DISCORD_BOT_TOKEN');

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
    let bot: GatewayBot | HTTPBot;
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

  const rest = new REST().setToken(token);

  const application = (await rest.get(
    Routes.oauth2CurrentApplication()
  )) as RESTGetAPIOAuth2CurrentApplicationResult;

  await rest.put(Routes.applicationCommands(application.id), {
    body: commands,
  });

  log('purplet', `${options.delete ? 'Deleted' : 'Deployed'} commands successfully.`);
}
