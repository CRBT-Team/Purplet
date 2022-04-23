import { ChatCommand, OptionBuilder } from 'purplet';

export default ChatCommand({
  name: 'hello',
  description: 'Says hello',
  options: new OptionBuilder()
    .string('name', 'The name to say hello to', {
      required: false,
    })
    .boolean('greeting', 'Whether to say a greeting')
    .integer('age', 'The age of the person to greet')
    .role('role', 'The role to mention')
    .user('user', 'The user to mention')
    .mentionable('mentionable', 'The mentionable to mention')
    .string('word', 'what to say', {
      choices: {
        hello: 'Hello',
        goodbye: 'Goodbye',
        afternoon: 'Good Afternoon',
      },
    })
    .channel('channel', 'The channel to say hello to', { required: false })
    .channel('category', 'The channel to say hello to', {
      channelTypes: [4],
    })
    .number('number', 'The number to say hello to'),
  async handle(opts) {
    this.reply('lol');
  },
});
