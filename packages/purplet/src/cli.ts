// TODO: My own env solution, or something where we can reload this file.
import chalk from 'chalk';
import sade from 'sade';
import { buildGatewayBot, startDevelopmentBot } from './build-api';
import { setupEnv } from './internal';

console.log('');
console.log(chalk.yellowBright('⚠️ Purplet v__VERSION__ is beta software! ⚠️'));
console.log(chalk.yellowBright('Report issues to https://github.com/CRBT-Team/purplet/issues'));
console.log('');

setupEnv();

const prog = sade('purplet');
prog
  .version('__VERSION__')
  .command('dev')
  .describe('Start bot in development mode.')
  .action(() => {
    startDevelopmentBot({
      root: process.cwd(),
    });
  })
  .command('build')
  .describe('Build bot for production.')
  .action(() => {
    buildGatewayBot({
      root: process.cwd(),
    });
  });

prog.parse(process.argv);
