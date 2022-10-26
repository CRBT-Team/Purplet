/// <reference path="../../adapter-imports.d.ts" />

import config from '$$config';
import { importPolyfill, injectLogger, setGlobalEnv } from 'purplet/internal';

await importPolyfill();

if (config.injectLogger) {
  // TODO: allow config.injectLogger to be the config data passed
  injectLogger({});
}

setGlobalEnv({
  config,
});
