import { formatMessage } from '$lib/index';
import { ChatCommand, OptionBuilder } from 'purplet';

export default ChatCommand({
  name: 'hello',
  description: 'A cool command',
  options: new OptionBuilder().string('who', 'Say hello to who?', false),
  handle({ who }) {
    this.reply({
      embeds: [formatMessage(`Hello ${who ?? 'World'}}!`)],
    });
  },
});
