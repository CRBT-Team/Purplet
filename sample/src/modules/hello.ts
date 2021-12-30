import { ChatCommand, MessageContextCommand } from 'purplet';

export default ChatCommand({
  name: 'purplet version',
  description: 'Prints the version of purplet',
  async handle() {
    this.reply('purplet version: ' + process.versions.purplet);
  },
});

export const msgCommand = MessageContextCommand({
  name: 'Inspect',
  handle(msg) {
    this.reply(`ID: ${msg.id}\nUser: ${msg.author.tag}`);
  },
});
