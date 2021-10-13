import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const fnacy = yargs(hideBin(process.argv))
  .usage('$0 <command> [options]')
  .command('dev', 'development mode')
  .command('build', 'build coolness')
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .argv;
console.log(fnacy);
