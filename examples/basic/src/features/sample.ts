import { TextInputBuilder, TextInputStyle } from 'discord.js';
import { $mentionCommand, $modal, $slashCommand, ModalComponentBuilder, OptionBuilder } from 'purplet';

interface ModalProps {
  title: string;
}

export const myModal = $modal({
  create({ title }: ModalProps) {
    return new ModalComponentBuilder()
      .setTitle(title)
      .addInline(
        new TextInputBuilder()
          .setCustomId('name')
          .setLabel('Name')
          .setStyle(TextInputStyle.Short)
          .setRequired(false)
      );
  },
  handle(context) {
    this.reply({
      content: JSON.stringify(this.fields),
    });
  },
});

export const helloWorld = $slashCommand({
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

export default $mentionCommand({
  name: 'explode',
  argMatch: /(.*)/,
  async handle(options) {
    await this.client.application!.fetch();
    console.log(this.client.application?.owner?.id);
    this.reply('BOOM!');
  },
});
