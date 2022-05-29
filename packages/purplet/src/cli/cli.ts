// TODO: My own env solution, or something where we can reload this file.
import 'dotenv/config';
import * as dev from '../dev/dev';
import sade from 'sade';

const prog = sade('purplet');
prog
  .version('__VERSION__')
  .command('dev')
  .describe('Start bot in development mode.')
  .example('dev')
  .action(() => {
    dev.initializeDevelopmentMode({
      root: process.cwd(),
    });
  });

prog.parse(process.argv);
