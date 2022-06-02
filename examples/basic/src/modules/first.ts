import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { $buttonComponent, $chatCommand, MessageComponentBuilder, OptionBuilder } from 'purplet';

interface SampleContext {
  name: string;
}

export const SampleButton = $buttonComponent({
  create: (data: SampleContext) =>
    new ButtonBuilder() //
      .setStyle(ButtonStyle.Primary)
      .setLabel('Button for ' + data.name),

  handle(context) {
    this.showMessage({
      content: 'You clicked the button for ' + context.name,
    });
  },
});

export const helloWorld = $chatCommand({
  name: 'component',
  description: 'testing components',
  options: new OptionBuilder().string('name', 'name of button', { required: true }),
  async handle(options) {
    await this.showMessage({
      components: new MessageComponentBuilder() //
        .addInline(SampleButton.create({ name: options.name.toUpperCase() }))
        .addInline(SampleButton.create({ name: options.name.toLowerCase() })),
    });
  },
});
