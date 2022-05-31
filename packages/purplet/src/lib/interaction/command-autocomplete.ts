import {
  APIApplicationCommandAutocompleteInteraction,
  APIInteraction,
  AutocompleteInteraction,
  InteractionType,
} from 'discord.js';
import { PurpletInteraction } from './base';
import { djs } from '../global';

export class PurpletAutocompleteInteraction<
  Data extends APIApplicationCommandAutocompleteInteraction = APIApplicationCommandAutocompleteInteraction
> extends PurpletInteraction<Data> {
  /** Partial validator, if this return true, then `createInteraction` will use this class. */
  static matches(raw: APIInteraction): raw is APIApplicationCommandAutocompleteInteraction {
    return raw.type === InteractionType.ApplicationCommandAutocomplete;
  }

  toDJS() {
    // @ts-expect-error Discord.js marks this with wrong types.
    return new AutocompleteInteraction(djs, this.raw);
  }
}
