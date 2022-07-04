import { capitalize } from '$lib/utils';
import { $slashCommand, OptionBuilder } from 'purplet';

export default $slashCommand({
  name: 'hello',
  description: 'Say hello',
  options: new OptionBuilder() //
    .string('who', 'to who you are saying hello to'),

  async handle(options) {
    this.showMessage({
      content: `Hello ${capitalize(options.who ?? 'World')}!`,
    });
  },
});
