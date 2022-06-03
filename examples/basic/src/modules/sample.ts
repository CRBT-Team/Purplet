import { EmbedBuilder } from 'discord.js';
import { $chatCommand, $userContextCommand, OptionBuilder } from 'purplet';

export const helloWorld = $chatCommand({
  name: 'user_info',
  description: 'testing',
  options: new OptionBuilder().user('who', 'who am'),
  permissions: ['ManageEvents'],
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

export const usercmd = $userContextCommand({
  name: 'get message info',
  async handle(user) {
    const fetched = await user.fetch();
  },
});
