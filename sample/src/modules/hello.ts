import { formatMessage } from '$lib/index';
import { ChatCommand, OptionBuilder } from 'purplet';

export default ChatCommand({
  name: 'hello',
  description: 'A cool command',
  options: new OptionBuilder()
    .enum(
      'who',
      'Say hello to who?',
      {
        option1: 'Option 1',
        option2: 'Option 2',
      },
      true
    )
    .boolean('boolean_test', 'description', false),
  handle({ who, boolean_test }) {
    this.reply({
      embeds: [formatMessage(`Hello ${who ?? 'World'}}, boolean is ${boolean_test}`)],
    });
  },
});
