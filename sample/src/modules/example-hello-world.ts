import { TextInputComponent } from 'discord.js';
import { ChatCommand, ModalComponent, OptionBuilder, row } from 'purplet';

export default ChatCommand({
  name: 'hello',
  description: 'Says hello',
  descriptionLocalizations: {
    fr: 'Dit bonjour',
  },
  defaultPermission: true,
  options: new OptionBuilder()
    // .string('name', 'The name to say hello to', {
    //   async autocomplete({ name }) {
    //     return [
    //       {
    //         name: name ?? 'nice',
    //         value: this.user.id,
    //       },
    //     ];
    //   },
    // })
    // .string('word', 'How to say hello', {
    //   choices: {
    //     hello: 'Hello',
    //     goodbye: 'Goodbye',
    //     afternoon: 'Good Afternoon',
    //   },
    // })
    // .channel('category', 'The channel to say hello to', {
    //   channelTypes: [ChannelType.GuildCategory],
    // })
    // .number('times', 'How many times to say hello', {
    //   minValue: 1,
    //   maxValue: 3,
    // })
    .attachment('file', 'A file to say hello to', {
      required: false,
    }),
  async handle({ file }) {
    const modal = new Modal(null)
      .setTitle('Hello')
      .addComponents(
        row(
          new TextInputComponent()
            .setCustomId('name')
            .setLabel('Name')
            .setPlaceholder('Name')
            .setStyle('SHORT')
        ),
        row(
          new TextInputComponent()
            .setCustomId('cool')
            .setLabel('Came')
            .setPlaceholder('yeah')
            .setStyle('SHORT')
        )
      );

    this.showModal(modal);
  },
});

export const Modal = ModalComponent({
  handle() {
    this.reply(this.fields.getTextInputValue('cool'));
  },
});
