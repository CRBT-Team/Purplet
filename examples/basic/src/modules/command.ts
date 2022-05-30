import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  InteractionResponseType,
} from 'discord.js';
import { createFeature } from 'purplet';

export default createFeature({
  name: 'test',

  applicationCommands: () => [
    {
      type: ApplicationCommandType.ChatInput,
      name: 'yeah',
      description: 'is a test',
      default_member_permissions: null,
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'option',
          description: 'the value',
        },
      ],
    },
  ],

  interaction(i) {
    i.respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: 'test lmaof',
      },
    });
  },
});
