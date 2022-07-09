import {
  APIApplicationCommandAutocompleteInteraction,
  APIInteraction,
  ApplicationCommandOptionType,
  InteractionType,
} from 'purplet/types';
import { Interaction } from './base';
import {
  applyInteractionResponseMixins,
  createInteractionMixinList,
  InteractionResponseMixin,
} from './response';
import { createInstanceofGuard } from '../../utils/class';

export class AutocompleteInteraction<
  Data extends APIApplicationCommandAutocompleteInteraction = APIApplicationCommandAutocompleteInteraction
> extends Interaction<Data> {
  static is = createInstanceofGuard(AutocompleteInteraction);

  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIApplicationCommandAutocompleteInteraction {
    return raw.type === InteractionType.ApplicationCommandAutocomplete;
  }

  get commandType() {
    return this.raw.data.type;
  }

  get commandName() {
    return this.raw.data.name;
  }

  get options() {
    return this.raw.data.options ?? [];
  }

  get subcommandName() {
    return this.options.find(x => x.type === ApplicationCommandOptionType.Subcommand)?.name ?? null;
  }

  get subcommandGroupName() {
    return (
      this.options.find(x => x.type === ApplicationCommandOptionType.SubcommandGroup)?.name ?? null
    );
  }

  get fullCommandName() {
    return [this.commandName, this.subcommandGroupName, this.subcommandName]
      .filter(Boolean)
      .join(' ');
  }

  get focusedOption() {
    return this.raw.data.options.find(x => (x as any).focused)!;
  }

  getOption(name: string) {
    return this.raw.data.options.find(x => x.name === name);
  }
}

// Mixin the response methods.
const allowedMethods = createInteractionMixinList([
  //
  'showAutocompleteResponse',
]);

applyInteractionResponseMixins(AutocompleteInteraction, allowedMethods);
export interface AutocompleteInteraction extends InteractionResponseMixin<typeof allowedMethods> {}
