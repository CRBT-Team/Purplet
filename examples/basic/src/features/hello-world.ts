import { capitalize } from '$lib/utils';
import { $slashCommand, OptionBuilder } from 'purplet';

export default $slashCommand({
  name: 'hello',
  description: 'Say hello',
  options: new OptionBuilder() //
    .string('who', 'to who you are saying hello to'),

  // eslint-disable-next-line require-await, @typescript-eslint/require-await
  async handle(options) {
    this.showMessage(`Hello ${capitalize(options.who ?? 'World')}!`);
  },
});
