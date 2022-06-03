import {
  APIApplicationCommandAutocompleteInteraction,
  APIInteraction,
  AutocompleteInteraction,
  InteractionType,
} from 'discord.js';
import { PurpletInteraction } from './base';
import {
  applyInteractionResponseMixins,
  createInteractionMixinList,
  InteractionResponseMixin,
} from './response';
import { djs } from '../../lib/global';

export class PurpletAutocompleteInteraction<
  Data extends APIApplicationCommandAutocompleteInteraction = APIApplicationCommandAutocompleteInteraction
> extends PurpletInteraction<Data> {
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

  toDJS(): AutocompleteInteraction {
    // @ts-expect-error Discord.js marks this with wrong types.
    return new AutocompleteInteraction(djs, this.raw);
  }
}

// Mixin the response methods.
const allowedMethods = createInteractionMixinList([
  //
  'showAutocompleteResponse',
]);

applyInteractionResponseMixins(PurpletAutocompleteInteraction, allowedMethods);
export interface PurpletAutocompleteInteraction
  extends InteractionResponseMixin<typeof allowedMethods> {}
