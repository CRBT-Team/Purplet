import {
  APIApplicationCommandAutocompleteInteraction,
  APICommandAutocompleteInteractionResponseCallbackData,
  APIInteraction,
  AutocompleteInteraction,
  InteractionResponseType,
  InteractionType,
} from 'discord.js';
import { PurpletInteraction } from './base';
import { djs } from '../../global';
import type { JSONResolvable } from '../../../utils/plain';

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

  /** Responds with autocomplete options. */
  showAutocompleteResponse(
    choices: JSONResolvable<APICommandAutocompleteInteractionResponseCallbackData>
  ) {
    this.respond({
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: choices,
    });
  }

  toDJS(): AutocompleteInteraction {
    // @ts-expect-error Discord.js marks this with wrong types.
    return new AutocompleteInteraction(djs, this.raw);
  }
}
