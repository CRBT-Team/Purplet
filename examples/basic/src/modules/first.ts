import { $chatCommand, OptionBuilder } from 'purplet';

export const helloWorld = $chatCommand({
  name: 'hello',
  description: 'Say hello',
  options: new OptionBuilder(), //
  async handle(options) {
    const m = await this.showMessage({
      content: 'This will receive a followup in 5 seconds',
    });
  },
});
