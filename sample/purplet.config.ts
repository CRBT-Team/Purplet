import { defineConfig, TextCommandHandler } from 'purplet';

export default defineConfig({
  // Pass extra handlers here (since 1.2 handlers auto-register when you create an instance)
  discord: {
    // commandGuilds: ['949329353047687189'],
  },
  handlers: [
    new TextCommandHandler({
      prefix: '!',
    }),
  ],
});
