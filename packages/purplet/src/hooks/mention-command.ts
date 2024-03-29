import type { Awaitable } from '@paperdave/utils';
import { asyncMap } from '@paperdave/utils';
import { GatewayIntentBits } from 'purplet/types';
import { $gatewayEvent } from './gateway-event';
import { botUser } from '../env';
import { $intents } from '../lib/hook-core';
import { $merge } from '../lib/hook-merge';
import { Message } from '../structures';

interface MentionCommandData {
  name: string;
  args?: MentionCommandArgument[];
  handle(this: Message, ...args: any[]): void;
}

type MentionCommandArgument<To = unknown> =
  | RegExp
  | {
      match: RegExp;
      parse?(opts: MentionCommandArgumentParseOptions): Awaitable<To>;
    };

interface MentionCommandArgumentParseOptions {
  match: RegExpExecArray;
  message: Message;
}

export function $mentionCommand(params: MentionCommandData) {
  return $merge([
    $gatewayEvent('MESSAGE_CREATE', async apiMessage => {
      const message = new Message(apiMessage);

      const mention = botUser.toString();
      const command = `${mention} ${params.name}`;

      const prefix = message.content.trim().startsWith(command);
      if (!prefix) {
        return;
      }

      const args = message.content.trim().slice(command.length).split(/\s+/).slice(1);

      if (params.args) {
        const definedArgs = params.args.map(arg => (arg instanceof RegExp ? { match: arg } : arg));
        const newArgs = await asyncMap(definedArgs, (arg, i) => {
          const match = arg.match.exec(args[i]);
          if (match) {
            return arg.parse ? arg.parse({ match, message }) : match[0];
          }
          return undefined;
        });
        if (newArgs.includes(undefined)) {
          return;
        }
        params.handle.call(message, ...newArgs);
      } else {
        params.handle.call(message, ...args);
      }
    }),
    $intents([GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]),
  ]);
}

export const ArgTypes = {
  string: /^.*$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  number: {
    match: /^[-+]?[0-9]*\.?[0-9]+$/,
    parse({ match }: MentionCommandArgumentParseOptions) {
      return parseFloat(match[0]);
    },
  },
  integer: {
    match: /^[-+]?[0-9]+$/,
    parse({ match }: MentionCommandArgumentParseOptions) {
      return parseInt(match[0], 10);
    },
  },
  boolean: {
    match: /^(t(?:rue)?|f(?:alse)?|y(?:es)?|no?)$/i,
    parse({ match }: MentionCommandArgumentParseOptions) {
      return ['t', 'y'].includes(match[0].toLowerCase());
    },
  },
  snowflake: /^[0-9]{18,19}$/,
};
