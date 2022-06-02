import { ButtonBuilder, ButtonStyle } from 'discord.js';
import {
  $buttonComponent,
  $chatCommand,
  OptionBuilder,
  PurpletComponentInteraction,
} from 'purplet';

interface SampleContext {
  name: string;
}

export const SampleButton = $buttonComponent({
  create(data: SampleContext) {
    return new ButtonBuilder() //
      .setStyle(ButtonStyle.Primary)
      .setLabel('Button for ' + data.name);
  },
  handle(this: PurpletComponentInteraction, context) {
    // cool!
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
    this.showMessage({
      components: new messagecomp(),
    });
  },
});
