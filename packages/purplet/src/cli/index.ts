import * as dev from '../dev/dev';
import sade from 'sade';

declare const process: { argv: string[]; cwd(): string };

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
