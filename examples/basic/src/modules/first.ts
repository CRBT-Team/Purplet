import { EmbedBuilder, InteractionResponseType } from 'discord.js';
import { $djsUserCommand, $userCommand } from 'purplet';

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

export const getInfo2 = $djsUserCommand({
  name: 'Get Info (discord.js)',
  handle(target) {
    this.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('User')
          .setDescription('```json\n' + JSON.stringify(target.toJSON(), null, 2) + '\n```')
          .toJSON(),
      ],
    });
  },
});
