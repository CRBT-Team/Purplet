import { GatewayIntentBits, Message } from "discord.js";
import { createFeature } from "../lib/feature";

type MentionCommandArgs = string[] & { name: string };

interface MentionCommandData {
  /** Command name, may include spaces. */
  name: string;
  /** A regular expression that matches data after the mention and the command name, defaults to /^$/ aka an empty string. */
  argMatch?: RegExp;
  /** Handler function, where `this` is the message, and the argument passed is the regex match, but also including a `name` property which passes back the command name. */
  handle(this: Message, args: MentionCommandArgs): void;
}

export function $mentionCommand(params: MentionCommandData) {
  return createFeature({
    djsClient(client) {
      const mention = `<@${client.user!.id}>`;
      const command = `${mention} ${params.name}`;
      const argRegex = params.argMatch ?? /^$/;
      function handler(message: Message) {
        if (message.author.bot) return;

        const prefix = message.content.trim().startsWith(command);
        if (!prefix) return;

        const args = message.content.trim().slice(command.length).trim().match(argRegex);
        if (args) {
          params.handle.call(message, {
            name: params.name,
            ...args,
          });
        }
      }
      client.on("messageCreate", handler);
      return () => client.off("messageCreate", handler);
    },
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  })
}