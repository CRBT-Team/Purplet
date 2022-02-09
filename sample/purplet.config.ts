import { defineConfig, TextCommandHandler } from 'purplet';

export default defineConfig({
  // Pass extra handlers here (since 1.2 handlers auto-register when you create an instance)
  handlers: [
    new TextCommandHandler({
      prefix: '!',
    }),
  ],
});
