/* eslint-disable no-console */
import '@purplet/polyfill/src/polyfill.mjs';
import chalk from 'chalk';
import dedent from 'dedent';
import path from 'path';
import wrapAnsi from 'wrap-ansi';
import yargs from 'yargs';
import { injectLogger, Logger } from '@paperdave/logger';
import { hideBin } from 'yargs/helpers';
import { buildGateway } from './build';
import { deploy } from './deploy';
import { DevMode } from './dev';
import { guildManager } from './guild-manager';
import { sync } from './sync';

interface CLIProgram {
  start(): Promise<void>;
  stop?(): Promise<void>;
}

async function start(cmd: CLIProgram) {
  injectLogger();

  if ((process as any).isBun) {
    new Logger('bun!', { color: 'cyanBright' })('v' + process.versions.bun);
  }

  Logger.warn('⚠️  Purplet v__VERSION__ is beta software! ⚠️');
  Logger.warn('Report issues to https://github.com/CRBT-Team/purplet/issues');
  // Logger.debug(`purplet v__VERSION__`);

  try {
    await cmd.start();
  } catch (error) {
    Logger.error(error as any);
    process.exit(1);
  }

  let stopping = false;
  process.on('SIGINT', async () => {
    if (stopping) {
      return;
    }
    Logger.debug('Received SIGINT');

    stopping = true;

    await cmd.stop?.();

    process.exit(0);
  });
}

const rootPositional = [
  'root',
  {
    default: './',
    type: 'string',
    coerce(x: string) {
      return path.resolve(x);
    },
  },
] as const;

const cli = yargs(hideBin(process.argv))
  .scriptName('purplet')
  .version('__VERSION__')
  .usage('$0 <command> [options]')
  .alias('v', 'version')
  .alias('h', 'help')
  .options('verbose', {
    alias: 'V',
    describe: 'show debug logs',
    type: 'boolean',
    default: false,
  });

const longDescriptions: Record<string, string> = {};

// Commands
cli.command(
  'dev',
  'start in development mode',
  args => args.positional(...rootPositional),
  args => start(new DevMode(args))
);
longDescriptions['dev'] = dedent`
  Start purplet in development mode. Development mode uses vite to give you fast hot-reloading. The $DISCORD_TOKEN variable must be set to a bot that is in a few guilds, only intended for testing. Reloads will be slower with bots in over 5 guilds, and does not support bots in over 75 guilds.
`;
cli.command(
  'build',
  'build a production gateway client',
  args => args.positional(...rootPositional),
  args => start({ start: () => buildGateway(args) })
);
longDescriptions['build'] = dedent`
  Build a production gateway client to './dist', which can be run for an optimized production build without hot-reloading or server limits. Handles interactions unless you have an HTTP endpoint handled.
`;
cli.command(
  'build-http',
  'build a production http interaction handler',
  args => args.positional(...rootPositional)
  // args => {}
);
longDescriptions['build-http'] = dedent`
  Build a production http interaction handler to './dist', which can be run for an optimized production build without hot-reloading or server limits. Handles interactions unless you have a gateway client handled.
`;
cli.command(
  'deploy [--delete]',
  'manage production-deployed application commands',
  args =>
    args //
      .positional(...rootPositional)
      .option('delete', {
        alias: 'd',
        describe: 'delete all commands',
        type: 'boolean',
        default: false,
      }),
  args => start({ start: () => deploy(args) })
);
longDescriptions['deploy'] = dedent`
  Manage production-deployed application commands, as the production gateway client or http interaction handler does not do this for you. Pass --delete if you need to delete all commands.
  
  Development mode will not run with global application commands, as it uses guild-based commands for all of it's stuff.
`;
cli.command(
  'sync',
  'generate development-related files',
  args => args.positional(...rootPositional),
  args => start({ start: () => sync(args) })
);
longDescriptions['sync'] = dedent`
  Generate development-related files, such as the generated tsconfig.json file. You don't usually need to run this as 'purplet dev' will do this for you.
`;
cli.command(
  'guild-manager',
  "interactivly manage bot's current guilds",
  args =>
    args.positional('root', {
      default: './',
      type: 'string',
      coerce(x) {
        return path.resolve(x);
      },
    }),
  args => start({ start: () => guildManager(args) })
);
longDescriptions['guild-manager'] = dedent`
  Opens an interactive guild manager, which allows you to manage the bot's current guilds. This is useful if you run into issues with 'purplet dev' complaining about the number of guilds your bot is in.
`;

// Override printing methods
const _showHelp = cli.showHelp;
cli.showHelp = () =>
  _showHelp.call(cli, data => {
    const isRoot = data.startsWith('purplet <command>');

    const lines = data.split('\n');

    if (isRoot) {
      console.log(
        chalk.magentaBright(
          'Purplet v__VERSION__ - A simple framework to build modern Discord apps.'
        )
      );
      console.log(chalk.gray('docs & help: https://purplet.js.org'));
      console.log();
    } else {
      console.log(chalk.magentaBright(lines[0]));
    }

    const documentation = longDescriptions[lines[0].split(' ')[1]];
    const commands: string[] = [];
    const options: string[] = [];
    const positionals: string[] = [];

    let state = '';
    lines.slice(1).forEach(line => {
      if (line === 'Commands:') {
        state = 'commands';
      } else if (line === 'Options:') {
        state = 'options';
      } else if (line === 'Positionals:') {
        state = 'positionals';
      } else if (line !== '') {
        if (state === 'commands') {
          if (line.trim().startsWith('purplet')) {
            commands.push(line);
          } else {
            commands[commands.length - 1] += line.trim();
          }
        } else if (state === 'options') {
          options.push(line);
        } else if (state === 'positionals') {
          positionals.push(line);
        }
      }
    });

    commands.forEach(line => {
      console.log(
        chalk.whiteBright.bold(' $ ') +
          line
            .trim()
            .replace(
              /(purplet) ([^ ]+)/,
              (_, purplet, cmd) => `${chalk.magentaBright(purplet)} ${chalk.cyanBright(cmd)}`
            )
      );
    });
    console.log();
    console.log(wrapAnsi(documentation, 80));
    console.log();

    if (options.length > 0) {
      console.log('Options:');
      options.forEach(line => {
        console.log(
          '  ',
          line
            .trim()
            .replace(/\[.*?\]/g, brackets =>
              chalk[brackets.startsWith('[default: ') ? 'magentaBright' : 'yellowBright'](brackets)
            )
            .replace(/--?[a-zA-Z0-9_-]+/g, flag =>
              chalk[flag.startsWith('--') ? 'cyanBright' : 'greenBright'](flag)
            )
        );
      });
      console.log();
    }

    // next up may be an error, so inject the logger
    injectLogger();
  });

// Parse
cli.demandCommand().strictCommands().strictOptions().strict(true).parse();
