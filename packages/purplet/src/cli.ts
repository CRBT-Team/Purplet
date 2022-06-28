// TODO: My own env solution, or something where we can reload this file.
import path from 'path';
import sade from 'sade';
import { REST } from '@discordjs/rest';
import { RESTGetAPICurrentUserResult, Routes } from 'discord.js';
import { createRequire } from 'module';
import { buildGatewayBot } from './cli/build';
import { DevMode } from './cli/dev';
import type { GatewayBot } from './internal';
import { getEnvVar, setupEnv } from './lib/env';
import { injectLogger, log } from './lib/logger';

const require = createRequire(import.meta.url);

injectLogger();

log('warn', '⚠️  Purplet v__VERSION__ is beta software! ⚠️');
log('warn', 'Report issues to https://github.com/CRBT-Team/purplet/issues');

const prog = sade('purplet');
prog
  .version('__VERSION__')
  .option('project', 'The directory of the Purplet project', './')
  .command('dev')
  .describe('Start bot in development mode.')
  .action(opts => {
    setupEnv(false);
    new DevMode({
      root: path.resolve(opts.project),
    }).start();
  })
  .command('build')
  .describe('Build bot for production.')
  .action(opts => {
    setupEnv(true);
    buildGatewayBot({
      root: path.resolve(opts.project),
    });
  })
  .command('deploy')
  .describe('Deploy commands from a production-built bot.')
  .action(async () => {
    let resolved: string;
    try {
      resolved = require.resolve(process.cwd());
      console.log(`Deploying commands from current bot build.`);
    } catch (error) {
      console.error(
        `Could not resolve bot entry point. Make sure you run \`purplet build\` first.`
      );
      return;
    }
    const bot = (await import('file:///' + resolved)).default as GatewayBot;
    await bot.start({
      mode: 'production',
      gateway: false,
      checkIfProductionBot: false,
    });
    await bot.updateApplicationCommandsGlobal();
    log('purplet', `Application Commands have been deployed`);
  })
  .command('undeploy')
  .describe('Delete all global application commands.')
  .action(async () => {
    setupEnv(true);
    console.log(`Deleting commands on this bot.`);
    const token = getEnvVar('DISCORD_BOT_TOKEN');
    if (!token) {
      log('error', `Could not find discord bot token, please set \`$DISCORD_BOT_TOKEN\`.`);
      return;
    }
    const rest = new REST().setToken(token);
    const currentUser = (await rest.get(Routes.user())) as RESTGetAPICurrentUserResult;
    await rest.put(Routes.applicationCommands(currentUser.id), { body: [] });
    log('purplet', `Application Commands have been deleted`);
    process.exit();
  })
  .command('guild-manager')
  .describe('Interactive menu to view and leave guilds.')
  .action(async () => {
    console.log(`TODO:`);
  });

prog.parse(process.argv);
