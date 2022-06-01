import { $chatCommand, OptionBuilder } from 'purplet';

export const helloWorld = $chatCommand({
  name: 'hello',
  description: 'Say hello',
  options: new OptionBuilder().user('user', 'test').string('name', 'what is your name?', {
    autocomplete({ name: current, user }) {
      return [
        current && {
          name: current,
          value: current,
        },
        {
          name: 'something else',
          value: 'okay',
        },
        {
          name: current + '!!!',
          value: current + '!!!',
        },
      ].filter(Boolean);
    },
  }),
  handle(options) {
    this.showMessage({
      content: `whats up ${options.name ?? 'bro'}`,
    });
  },
});
