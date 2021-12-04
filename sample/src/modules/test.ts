import { getAllTextCommands, TextCommand } from 'purplet';

export const test1 = TextCommand({
  name: 'test',
  meta: {
    description: 'Test command',
  },
  async handle(args) {
    this.channel.send('Hello World! `' + JSON.stringify(args) + '`');
  },
});

export const help = TextCommand({
  name: 'help',
  meta: {
    description: 'Help command',
  },
  async handle() {
    const commands = getAllTextCommands();

    const text = [...commands.entries()].map(([name, command]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return `${name} - ${(command.meta as any).description}`;
    });

    this.channel.send(text.join('\n'));
  },
});
