export * from './Config';
export * from './Handler';
export * from './handlers/ChatCommand';
export * from './handlers/TextCommand';
export * from './Purplet';
export * from './setupEnv';
export * from './util/format';
export * from './util/OptionBuilder';

// run the cli module if this is run directly

import fs from 'fs-extra';
import path from 'path';

const thisFile = fs.realpathSync(
  path.resolve(import.meta.url.replace(/file:\/\//, '').replace(/^\/([A-Z]:\/)/, '$1'))
);
const runFile = fs.realpathSync(process.argv[1]);
if (thisFile === runFile) {
  import('./cli');
}
