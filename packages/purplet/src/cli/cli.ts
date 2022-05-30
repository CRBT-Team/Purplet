// TODO: My own env solution, or something where we can reload this file.
import 'dotenv/config';
import * as build from '../build/build';
import * as dev from '../dev/dev';
import sade from 'sade';

const prog = sade('purplet');
prog
  .version('__VERSION__')
  .command('dev')
  .describe('Start bot in development mode.')
  .action(() => {
    dev.initializeDevelopmentMode({
      root: process.cwd(),
    });
  })
  .command('build')
  .describe('Build bot for production.')
  .action(() => {
    build.runBuild({
      root: process.cwd(),
    });
  });

prog.parse(process.argv);
