import { $buttonComponent, $selectMenuComponent, $slashCommand, MessageComponentBuilder } from 'purplet';
import { ButtonBuilder, ButtonStyle, SelectMenuBuilder } from 'discord.js';

interface SampleContext {
  name: string;
}

export const mySelect = $selectMenuComponent({
  create(ctx: SampleContext) {
    return new SelectMenuBuilder() //
      .setPlaceholder(`Select for ${ctx.name}`)
      .setOptions([
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' },
      ]);
  },
  handle(context) {
    this.reply(`You selected ${context.values.join(' and ')} on the menu for ${context.name}`);
  },
});
