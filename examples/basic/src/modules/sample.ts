import { EmbedBuilder } from 'discord.js';
import { $chatCommand, OptionBuilder } from 'purplet';

export const helloWorld = $chatCommand({
  name: 'user_info',
  description: 'testing',
  options: new OptionBuilder().user('who', 'who am'),
  async handle(options) {
    await this.showMessage({
      embeds: [
        new EmbedBuilder()
          .setTitle('User')
          .setDescription('```json\n' + JSON.stringify(this.user, null, 2) + '\n```'),
      ],
    });
  },
});
