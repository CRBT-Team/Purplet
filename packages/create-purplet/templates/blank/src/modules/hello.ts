import { GatewayIntentBits, Message } from 'discord.js';
import { createFeature } from 'purplet';

export const logMessages = createFeature({
  djsClient({ featureId, client }) {
    console.log(`${featureId} loaded and ${client.user.tag}!`);

    function handleMessage(msg: Message) {
      console.log(`${featureId} message: ${msg.author.tag}: ${msg.content}`);
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
});
