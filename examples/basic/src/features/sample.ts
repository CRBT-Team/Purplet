import { ButtonBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { $buttonComponent, $mentionCommand, $modal, $slashCommand, $slashCommandGroup, ModalComponentBuilder, OptionBuilder } from 'purplet';

interface SampleContext {
  name: string;
}

export const button = $buttonComponent({
  create(ctx: SampleContext) {
    return new ButtonBuilder()
      .setLabel(ctx.name);
  },
  handle(ctx) {
    console.log(ctx.name);
  }
});
