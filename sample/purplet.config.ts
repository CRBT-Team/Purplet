import { $config, MentionCommandHandler } from 'purplet';

const config = $config({
  // Pass extra handlers here (since 1.2 handlers auto-register when you create an instance)
  handlers: [new MentionCommandHandler()],
});

export default config;
