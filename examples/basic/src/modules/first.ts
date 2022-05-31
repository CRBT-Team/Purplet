import { InteractionResponseType } from 'discord.js';
import { $chatCommand, OptionBuilder } from 'purplet';

export const helloWorld = $chatCommand({
  name: 'hello',
  description: 'Say hello',
  options: new OptionBuilder().string('name', 'what is your name?', { required: true }),
  handle(options) {
    this.respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        allowed_mentions: {
          parse: [],
        },
        content: `Hello ${options.name}!`,
      },
    });
  },
});
