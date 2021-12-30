import { ChatCommand } from 'purplet';

export default ChatCommand({
  name: 'purplet version',
  description: 'Prints the version of purplet',
  async handle() {
    this.reply('purplet version: ' + process.versions.purplet);
  },
});
