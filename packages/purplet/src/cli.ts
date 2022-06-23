// TODO: My own env solution, or something where we can reload this file.
import { REST } from '@discordjs/rest';
import chalk from 'chalk';
import { RESTGetAPICurrentUserResult, Routes } from 'discord.js';
import { createRequire } from 'module';
import path from 'path';
import sade from 'sade';
import { buildGatewayBot } from './build/build';
import { startDevelopmentBot } from './dev/dev';
import type { GatewayBot } from './internal';
import { getEnvVar, setupEnv } from './lib/env';

const require = createRequire(import.meta.url);

console.log('');
console.log(chalk.yellowBright('⚠️ Purplet v__VERSION__ is beta software! ⚠️'));
console.log(chalk.yellowBright('Report issues to https://github.com/CRBT-Team/purplet/issues'));
console.log('');

const prog = sade('purplet');
prog
  .version('__VERSION__')
  .option('project', 'The directory of the Purplet project', './')
  .command('dev')
  .describe('Start bot in development mode.')
  .action((opts) => {
    setupEnv(false);
    startDevelopmentBot({
      root: path.resolve(opts.project),
    });
  })
  .command('build')
  .describe('Build bot for production.')
  .action((opts) => {
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
      console.error(`Could not resolve bot entry point. Make sure you run \`purplet build\` first.`);
      return;
    }
    const bot = (await import(resolved)).default as GatewayBot;
    await bot.start({
      mode: 'production',
      gateway: false,
    });
    await bot.updateApplicationCommandsGlobal();
    console.log(`Deployed.`);
  })
  .command('undeploy')
  .describe('Delete all global application commands.')
  .action(async () => {
    setupEnv(true);
    const token = getEnvVar('DISCORD_BOT_TOKEN');
    if (!token) {
      console.error(`Could not find discord bot token, please set \`$DISCORD_BOT_TOKEN\`.`);
      return;
    }
    const rest = new REST().setToken(token);
    const currentUser = (await rest.get(Routes.user())) as RESTGetAPICurrentUserResult;
    await rest.put(Routes.applicationCommands(currentUser.id), { body: [] });
    console.log(`Commands deleted.`);
    process.exit();
  })
  .command('guild-manager')
  .describe('Interactive menu to view and leave guilds.')
  .action(async () => {
    console.log(`TODO:`);
  });

prog.parse(process.argv);
