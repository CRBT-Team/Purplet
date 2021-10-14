import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { build } from './build';
import { dev } from './dev';

const args = yargs(hideBin(process.argv))
  .usage('$0 <command> [options]')
  .command('dev', 'development mode')
  .command('build', 'build coolness')
  .option('root', {
    alias: 'r',
    describe: 'root directory',
    type: 'string',
    default: './',
  })
  .options('keep-tmp', {
    alias: 'k',
    describe: 'keep temporary files from compilation',
    type: 'boolean',
    default: process.env.NODE_ENV === 'development',
  })
  .help()
  .parseSync();

export type Args = typeof args;

const command = args._[0];

args.root = path.join(process.cwd(), args.root);

if (!command || command === 'dev') {
  dev(args);
} else if (command === 'build') {
  build(args);
} else {
  console.log('unknown command');
}
