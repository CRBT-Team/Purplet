// TODO: My own env solution, or something where we can reload this file.
import 'dotenv/config';
import sade from 'sade';
import { buildGatewayBot, startDevelopmentBot } from './build-api';

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
