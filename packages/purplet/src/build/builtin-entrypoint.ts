/// <reference path="../../adapter-imports.d.ts" />

import '@purplet/polyfill';
import config from '$$config';
import { injectLogger } from '@paperdave/logger';
import { setGlobalEnv } from 'purplet/internal';

if (config.injectLogger) {
  // TODO: allow config.injectLogger to be the config data passed
  injectLogger({});
}

setGlobalEnv({
  config,
});
