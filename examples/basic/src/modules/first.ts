import { EmbedBuilder, InteractionResponseType } from 'discord.js';
import { $userContextCommand, OptionBuilder } from 'purplet';

export const getInfo1 = $userContextCommand({
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

const x = new OptionBuilder() //
  .attachment('file', 'coolio')
  .mentionable('who', 'yeah', {
    required: true,
  });
//

x;
