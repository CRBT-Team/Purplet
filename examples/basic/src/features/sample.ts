import { TextInputBuilder, TextInputStyle } from 'discord.js';
import { $chatCommand, $modal, ModalComponentBuilder, OptionBuilder } from 'purplet';

interface ModalProps {
  title: string;
}

export const myModal = $modal({
  create({ title }: ModalProps) {
    return new ModalComponentBuilder().addInline(
      new TextInputBuilder()
        .setCustomId('name')
        .setLabel('Name')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
    );
  },
  handle() {
    this.reply({
      content: JSON.stringify(this.fields),
    });
  },
});

export const helloWorld = $chatCommand({
  name: 'modal_test',
  description: 'show a modal',
  options: new OptionBuilder().string('title', 'the title', { required: false }),
  async handle(options) {
    this.showModal(
      myModal.create({
        title: options.title ?? 'Stuff',
      })
    );
  },
});
