import { $slashCommand, components, createLinkButton, OptionBuilder, row } from 'purplet';

export default $slashCommand({
  name: 'hello',
  description: 'Says hello',
  options: new OptionBuilder().string('name', 'The name to say hello to', {
    minLength: 2,
  }),
  async handle({ file }) {
    this.reply({
      components: components(row(createLinkButton('Hello', 'https://clembs.com'))),
    });
  },
});
