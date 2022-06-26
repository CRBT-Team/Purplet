import { ApplicationCommandData, createFeature } from '../lib/feature';
import { CommandInteraction, SlashCommandInteraction } from '../structures';

export interface ApplicationCommandHookData {
  command: ApplicationCommandData;
  handle(this: CommandInteraction): void;
}

function getCommandName(interaction: CommandInteraction) {
  return interaction instanceof SlashCommandInteraction
    ? interaction.fullCommandName
    : interaction.commandName;
}

export function $applicationCommand(opts: ApplicationCommandHookData) {
  return createFeature({
    applicationCommands: [opts.command],
    interaction(i) {
      if (
        i instanceof CommandInteraction &&
        i.commandType === opts.command.type &&
        getCommandName(i) === opts.command.name
      ) {
        opts.handle.call(i);
      }
    },
  });
}
