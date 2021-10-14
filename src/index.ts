export * from './Config';
export * from './Handler';
export * from './handlers/ChatCommand';
export * from './Purplet';
export * from './util/OptionBuilder';

// run the cli module if this is run directly

import path from 'path';
if (path.resolve(import.meta.url.replace(/file:\/+/, '')) === process.argv[1]) {
  import('./cli');
}
