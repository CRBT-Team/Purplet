import { ButtonStyle } from 'discord-api-types/v10';
import { $buttonComponent, $slashCommand, MessageComponentBuilder } from 'purplet';

interface Data {
  id: string;
}

export const myButton = $buttonComponent({
  template(data: Data) {
    return {
      label: `Set to ${data.id}`,
      style: ButtonStyle.Primary,
    };
  },
  handle(data) {
    this.updateMessage({
      content: `The current id is \`${data.id}\``,
    });
  },
});

export const command = $slashCommand({
  name: 'component_test',
  description: 'framework experiment',
  async handle() {
    this.showMessage({
      content: `Message content`,
      components: new MessageComponentBuilder()
        .addInline(myButton.create({ id: 'one' }))
        .addInline(myButton.create({ id: 'two' })),
    });
  },
});
