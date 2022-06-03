import {
  APIApplicationCommandAutocompleteInteraction,
  APIInteraction,
  InteractionType,
} from 'discord-api-types/v10';
import { Interaction } from './base';
import {
  applyInteractionResponseMixins,
  createInteractionMixinList,
  InteractionResponseMixin,
} from './response';

export class AutocompleteInteraction<
  Data extends APIApplicationCommandAutocompleteInteraction = APIApplicationCommandAutocompleteInteraction
> extends Interaction<Data> {
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
