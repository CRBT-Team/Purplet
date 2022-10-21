// Runtime entrypoint for Purplet + Node.js/Bun.
// This file also serves an example on how to write runtime entrypoints.

// Due to a handful of custom build plugins and extra code, we have a handful of special imports.
// The following reference comment includes the typedefs.
/// <reference path="../../../runtime-imports.d.ts" />

// Before this file loads at all, `packages/purplet/src/build/builtin-entrypoint.ts` is imported,
// preparing `purplet/env`'s global state, as well as the logger and error handler. Aside from
// starting up the bot, runtimes are responsible for finishing the global state setup.

// This import pulls an array of all the bot features.
import features from '$$features';
// For certain runtimes, it may be desirable to only import a subset of features:
// import onlyInteraction from '$$features/interaction';
//
// To modify the values in `purplet/env`, runtimes are given a `setGlobalEnv` function. This
// import also contains our Gateway class.
import type { GatewayBotOptions } from '$$runtime';
import { GatewayBot, setGlobalEnv } from '$$runtime';
//
import { Rest } from '@purplet/rest';
// We have a number of internal APIs. These are not documented and are subject to change. Sorry.
import { errorNoToken, isDirectlyRun } from 'purplet/internal';

// The runtime has to get a hold of the environment variables and the token. In this case,
// the .env file is loaded by `@purplet/polyfill`
setGlobalEnv({
  env: process.env,
});

// We validate that the token is set, and throw an pretty error if it isn't.
// (`errorNoToken` is an internal message shared with dev mode)
const token = process.env.DISCORD_TOKEN!;
if (!token) {
  throw errorNoToken();
}

// We need to set a global rest client, which is as easy as passing with the token.
setGlobalEnv({
  rest: new Rest({ token }),
});

// Development mode and production mode share the same class, but here we extend it to add
// the token as a default variable.
class BuiltBot extends GatewayBot {
  constructor(opts: Partial<GatewayBotOptions> = {}) {
    super({
      token,
      ...opts,
    });
    // Load all the features
    this.patchFeatures({ add: features });
  }
}

// You can export whatever you want from here. For certain cloud providers, they will need you
// to export a function to handle a http request, for example.
export default BuiltBot;

// Most people are going to run this file directly, so we run the bot on start.
// For advanced usecases, they can also import this file and this logic will not run.
if (isDirectlyRun(import.meta.url)) {
  await new BuiltBot().start();
}
