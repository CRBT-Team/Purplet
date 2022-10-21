import { ApplicationCommandOptionType } from 'discord-api-types/payloads';

export class OptionBuilder {
  /** @type {import('purplet/types').APIApplicationCommandOption[]} */
  options = [];
  /** @type {Record<string, import('./OptionBuilder').Autocomplete>} */
  autocompleteHandlers = {};

  /** @param {import('purplet/types').ApplicationCommandOptionType} type */
  #createOption(type) {
    /**
     * @param {string} name
     * @param {string} description
     * @param {Record<string, any>} opts
     */
    return (name, description, opts = {}) => {
      /** @type {any} */
      const obj = {
        type,
        name,
        description,
        required: opts.required,
        min_value: opts.minValue ?? undefined,
        max_value: opts.maxValue ?? undefined,
        min_length: opts.minLength ?? undefined,
        max_length: opts.maxLength ?? undefined,
        channel_types: opts.channelTypes ?? undefined,
        name_localizations: opts.nameLocalizations ?? undefined,
        description_localizations: opts.descriptionLocalizations ?? undefined,
      };

      if (opts.autocomplete) {
        this.autocompleteHandlers[name] = opts.autocomplete;
        obj.autocomplete = true;
      }

      if (opts.choices) {
        obj.choices = Object.entries(opts.choices).map(([key, displayName]) => {
          /** @type {string | number} */
          let value = key;

          // value may be converted to string, undo that:
          if (
            type === ApplicationCommandOptionType.Number ||
            type === ApplicationCommandOptionType.Integer
          ) {
            value = Number(value);
          }

          return {
            name: displayName,
            name_localizations: opts.choiceLocalizations?.[key] ?? undefined,
            value,
          };
        });
      }

      this.options.push(obj);

      return this;
    };
  }

  string = this.#createOption(ApplicationCommandOptionType.String);
  integer = this.#createOption(ApplicationCommandOptionType.Integer);
  boolean = this.#createOption(ApplicationCommandOptionType.Boolean);
  channel = this.#createOption(ApplicationCommandOptionType.Channel);
  user = this.#createOption(ApplicationCommandOptionType.User);
  mentionable = this.#createOption(ApplicationCommandOptionType.Mentionable);
  role = this.#createOption(ApplicationCommandOptionType.Role);
  number = this.#createOption(ApplicationCommandOptionType.Number);
  attachment = this.#createOption(ApplicationCommandOptionType.Attachment);

  toJSON() {
    return this.options;
  }
}

/** @param {OptionBuilder} builder */
export function getOptionBuilderAutocompleteHandlers(builder) {
  return builder ? builder.autocompleteHandlers : {};
}
