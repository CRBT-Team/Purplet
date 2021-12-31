import { defineConfig } from 'purplet';

export default defineConfig({
  discord: {
    // pass a list of guilds to apply commands to. this is required for development mode.
    commandGuilds: [],
  },
  // Pass extra handlers here (since 1.2 handlers auto-register when you create an instance)
  handlers: [],
});
