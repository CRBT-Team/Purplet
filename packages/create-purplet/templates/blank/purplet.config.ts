import { ChatCommandHandler, defineConfig } from 'purplet';

// This config is picked up by Purplet to configure your bot.

export default defineConfig({
  discord: {
    // This is where you would put your development server IDs. Leave blank to ship globally (only for production).
    commandGuilds: [],
    clientOptions: {
      // discord.js client options
    },
  },
  handlers: [
    // This is where you would put Purplet handlers and your own.
    // More docs about handlers soon.
    new ChatCommandHandler(),
  ],
});
