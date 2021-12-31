export * from './Config';
export * from './Handler';
export * from './handlers/ChatCommand';
export * from './handlers/Component';
export * from './handlers/ContextCommand';
export * from './handlers/Global';
export * from './handlers/OnEvent';
export * from './handlers/PresenceProvider';
export * from './handlers/Service';
export * from './handlers/TextCommand';
export * from './Purplet';
export * from './setupEnv';
export * from './util/components';
export * from './util/format';
export * from './util/OptionBuilder';

// run the cli module if this is run directly

import fs from 'fs-extra';
import path from 'path';
import pkg from '../package.json';

process.versions.purplet = `${pkg.version}${process.env.NODE_ENV === 'development' ? '-dev' : ''}`;

const thisFile = fs.realpathSync(
  path.resolve(import.meta.url.replace(/file:\/\//, '').replace(/^\/([A-Z]:\/)/, '$1'))
);
const runFile = fs.realpathSync(process.argv[1]);
if (thisFile === runFile) {
  import('./cli');
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessVersions {
      purplet: string;
    }
  }
}
