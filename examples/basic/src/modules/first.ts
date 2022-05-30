import {
  ApplicationCommandType,
  ButtonStyle,
  ComponentType,
  GatewayIntentBits,
  Message,
} from 'discord.js';
import { $onDJSEvent, createFeature } from 'purplet';

export const logMessages = createFeature({
  name: 'log messages',

  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],

  interaction(i) {},

  applicationCommands: () => [
    {
      type: ApplicationCommandType.ChatInput,
      name: 'log',
      description: 'Logs a message to the console',
      default_member_permissions: '421',
    },
  ],
});

export const messageListener = $onDJSEvent('messageCreate', (msg: Message) => {
  console.log(msg.content);
  if (msg.content === '!test') {
    msg.channel.send({
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
    });
  }
});
