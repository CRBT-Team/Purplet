import { defineConfig, TextCommandHandler } from 'purplet';

export default defineConfig({
  discord: {
    commandGuilds: ['782584672298729473'],
  },
  handlers: [
    //
    new TextCommandHandler({
      prefix: '!',
    }),
  ],
});
