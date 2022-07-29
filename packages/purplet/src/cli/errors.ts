import chalk from 'chalk';
import dedent from 'dedent';
import type { Gateway, GatewayExitError } from '@purplet/gateway';
import { GatewayCloseCodes, GatewayIntentBits, GatewayVersion } from 'purplet/types';
import { CLIError } from '../lib/errors';
import { IntentsBitfield } from '../structures';
import { camelCaseToEnumCase } from '../utils/case';

const magenta = chalk.magentaBright;
const cyan = chalk.cyanBright;

const devPortalLink = magenta('https://discordapp.com/developers/applications');

export function errorNoToken() {
  return new CLIError(
    'Missing DISCORD_BOT_TOKEN environment variable!',
    dedent`
      Please create an ${cyan('.env')} file with the following contents:
      
        ${chalk.cyanBright('DISCORD_BOT_TOKEN')}=${chalk.grey('<your bot token>')}
      
      You can create or reset your bot token at ${devPortalLink}
    `
  );
}

export function errorNoIncludeAndExcludeGuilds() {
  return new CLIError('Cannot specify both PURPLET_INCLUDE_GUILDS and PURPLET_EXCLUDE_GUILDS');
}

export function errorFromGatewayClientExitError({ code }: GatewayExitError, client: Gateway) {
  switch (code) {
    case GatewayCloseCodes.AuthenticationFailed:
      return new CLIError(
        'Invalid Bot Token!',
        dedent`
          The token inside of ${cyan(
            '.env'
          )} file is invalid or expired. Please create a new token at ${devPortalLink} and update the environment variable.
        `
      );
    case GatewayCloseCodes.DisallowedIntents: {
      const specialIntents = [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
      ];
      const names = new IntentsBitfield(client.options.intents)
        .filter(x => specialIntents.includes(x))
        .toStringArray()
        .map(camelCaseToEnumCase);

      return new CLIError(
        'Disallowed Intents!',
        dedent`
          Your bot requires the following privileged intents:
          ${names.map(x => `  - ${chalk.cyanBright(x)}`).join('\n')}

          You can configure your enabled intents at the developer portal. If your bot is already verified, you will have to go through further steps to re-verify your new intents.
          ${chalk.magentaBright('https://discord.com/developers/applications')}
        `
      );
    }
    case GatewayCloseCodes.InvalidIntents: {
      const names2 = new IntentsBitfield(client.options.intents)
        .toStringArray()
        .map(camelCaseToEnumCase);

      return new CLIError(
        'Disallowed Intents!',
        dedent`
          Intents value: ${chalk.cyanBright(client.options.intents)}
          Flags:
          ${names2.map(x => `  - ${chalk.cyanBright(x)}`).join('\n')}
        `
      );
    }
    case GatewayCloseCodes.ShardingRequired:
      return new CLIError(
        'Sharding Required!',
        dedent`
          Your bot is in too many guilds to be handled on one shard. Unfortunatly, Purplet currently does not have sharding built-in just yet. Sorry.
        `
      );
    case GatewayCloseCodes.InvalidAPIVersion:
      return new CLIError(
        'Invalid Discord API Version!',
        dedent`
          The Discord API Does not support version ${chalk.cyanBright(
            GatewayVersion
          )}. Please update the purplet library to the latest version.
        `
      );
    default:
      return new CLIError(
        `Gateway disconnected with code: ${camelCaseToEnumCase(GatewayCloseCodes[code])} (${code})`
      );
  }
}

export function errorTooManyGuilds() {
  return new CLIError(
    'Too Many Guilds',
    `You can't have more than 75 guilds during development mode. Please switch bot tokens to a smaller bot, or use ${magenta(
      'purplet guild-manager'
    )} to manage your guilds.`
  );
}
