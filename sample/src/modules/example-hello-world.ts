import { TextInputComponent } from 'discord.js';
import { ChatCommand, ModalComponent, OptionBuilder, row } from 'purplet';

export default ChatCommand({
  name: 'hello',
  description: 'Says hello',
  descriptionLocalizations: {
    fr: 'Dit bonjour',
  },
  allowInDMs: true,
  defaultPermission: false,
  options: new OptionBuilder().string('name', 'The name to say hello to', {
    minLength: 2,
  }),
  async handle({ file }) {
    const modal = new Modal()
      .setTitle('Hello')
      .addComponents(
        row(
          new TextInputComponent()
            .setCustomId('name')
            .setLabel('Name')
            .setPlaceholder('Name')
            .setStyle('SHORT')
        )
      );

    this.showModal(modal);
  },
});

export const Modal = ModalComponent({
  handle(ctx: undefined) {
    this.reply(this.fields.getTextInputValue('cool'));
  },
});
