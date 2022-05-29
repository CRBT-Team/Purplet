import { GatewayIntentBits, Message } from 'discord.js';
import { createFeature } from 'purplet';

export const logMessages = createFeature('log messages', {
  async djsClient({ featureId, client }) {
    console.log(`${featureId} loaded and on ${client.user.tag}!!!`);

    function handleMessage(msg: Message) {
      console.log(`${featureId} msg: ${msg.author.tag}: ${msg.content}`);
    }

    client.on('messageCreate', handleMessage);

    // Cleanup function, run on hot reload (or other unload/shutdown reason)
    return () => {
      client.off('messageCreate', handleMessage);
    };
  },

  gatewayIntents: () =>
    GatewayIntentBits.Guilds + GatewayIntentBits.MessageContent + GatewayIntentBits.GuildMessages,
});
