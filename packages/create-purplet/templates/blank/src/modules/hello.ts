import { ChatCommand, OptionBuilder } from 'purplet';

export default ChatCommand({
  name: 'hello',
  description: 'Your starter Purplet command. Say hello to someone.',
  options: new OptionBuilder().user('user', 'Who to say hello to.'),
  async handle({ user }) {
    this.reply(`Hello ${user ?? 'world'}!`);
  },
});
