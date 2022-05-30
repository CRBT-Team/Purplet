import {
  ButtonStyle,
  ComponentType,
  GatewayIntentBits,
  InteractionResponseType,
  Routes,
} from 'discord.js';
import { createFeature, rest } from 'purplet';

export default createFeature({
  name: 'test',

  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],

  gatewayEvent: {
    MESSAGE_CREATE(message) {
      if (message.content === '!test') {
        rest.post(Routes.channelMessages(message.channel_id), {
          body: {
            content: 'test',
            components: [
              {
                type: ComponentType.ActionRow,
                components: [
                  {
                    type: ComponentType.Button,
                    label: 'test',
                    style: ButtonStyle.Primary,
                    custom_id: 'test',
                  },
                ],
              },
            ],
          },
        });
      }
    },
  },

  interaction(i) {
    i.respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: 'test lmaof',
      },
    });
  },
});
