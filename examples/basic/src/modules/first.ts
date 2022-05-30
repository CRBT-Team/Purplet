import { ApplicationCommandType, GatewayIntentBits, Message } from 'discord.js';
import { createFeature } from 'purplet';

export const logMessages = createFeature({
  name: 'log messages',

  djsClient(client) {
    console.log(`${this.featureId} loaded and ${client.user.tag}!`);

    function handleMessage(msg: Message) {
      console.log(`${this.featureId} message: ${msg.author.tag}: ${msg.content}`);
    }

    client.on('messageCreate', handleMessage);

    // Cleanup function, run on hot reload (or other unload/shutdown reason)
    return () => {
      client.off('messageCreate', handleMessage);
    };
  },

  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],

  applicationCommands: () => [
    {
      type: ApplicationCommandType.ChatInput,
      name: 'log',
      description: 'Logs a message to the console',
      default_member_permissions: '421',
    },
  ],
});
