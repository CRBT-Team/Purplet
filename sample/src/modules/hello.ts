import { ChatCommand, OptionBuilder } from 'purplet';

export default ChatCommand({
  name: 'hello',
  description: 'A cool command',
  options: new OptionBuilder()
    .boolean('boolean', 'Boolean', false)
    .number('number', 'Number', false)
    .integer('integer', 'Integer', false)
    .string('string', 'String', false)
    .mentionable('mentionable', 'Mentionable', false)
    .role('role', 'Role', false)
    .user('user', 'User', false)
    .channel('channel', 'Channel', false),
  handle(args) {
    this.reply(
      [
        args.boolean !== undefined ? `Boolean: ${args.boolean}` : 'No boolean passed',
        args.number !== undefined ? `Number: ${args.number}` : 'No number passed',
        args.integer !== undefined ? `Integer: ${args.integer}` : 'No integer passed',
        args.string !== undefined ? `String: ${args.string}` : 'No string passed',
        args.mentionable !== undefined
          ? `Mentionable: ${args.mentionable}`
          : 'No mentionable passed',
        args.role !== undefined ? `Role: ${args.role}` : 'No role passed',
        args.user !== undefined ? `User: ${args.user}` : 'No user passed',
        args.channel !== undefined ? `Channel: ${args.channel}` : 'No channel passed',
      ].join('\n')
    );
  },
});
