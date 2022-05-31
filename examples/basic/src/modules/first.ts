import { EmbedBuilder, InteractionResponseType } from 'discord.js';
import { $userCommand, OptionBuilder } from 'purplet';

export const getInfo1 = $userCommand({
  name: 'Get Info (purplet)',
  handle(target) {
    this.respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        allowed_mentions: {},
        embeds: [
          new EmbedBuilder()
            .setTitle('User')
            .setDescription('```json\n' + JSON.stringify(target, null, 2) + '\n```')
            .toJSON(),
        ],
      },
    });
  },
});

const x = new OptionBuilder()
  .string('name', 'your name goes here', {
    required: true,
  })
  .string('last_name', 'your last name goes here', {
    required: false,
  })
  .string('ice_cream_flavor', 'what do you want', {
    choices: {
      vanilla: 'Vanilla',
      chocolate: 'Chocolate',
      strawberry: 'Strawberry',
      mint: 'Mint',
    },
  });

x;
