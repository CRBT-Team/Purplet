import { ChatCommand } from 'purplet';

export default ChatCommand({
  name: 'hello',
  description: 'Says hello',
  async handle() {
    this.reply('Hello!');
  },
});
