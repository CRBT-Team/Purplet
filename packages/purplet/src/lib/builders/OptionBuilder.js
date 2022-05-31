// be careful changing this file

import { ApplicationCommandOptionType } from 'discord.js';

export class OptionBuilder {
  options = [];
  autocompleteHandlers = {};

  #createOption(type) {
    return (name, description, opts = {}) => {
      const obj = {
        type,
        name,
        description,
        min_value: opts.minValue ?? undefined,
        max_value: opts.maxValue ?? undefined,
        channel_types: opts.channelTypes ?? undefined,
        name_localizations: opts.nameLocalizations ?? undefined,
        description_localizations: opts.descriptionLocalizations ?? undefined,
      };

      if (obj.required === undefined) {
        obj.required = false;
      }

      if (opts.autocomplete) {
        this.autocompleteHandlers[name] = opts.autocomplete;
        obj.autocomplete = true;
      }

      if (opts.choices) {
        obj.choices = Object.entries(opts.choices).map(([value, displayName]) => {
          // value may be converted to string, undo that:
          if (type === 'NUMBER' || type === 'INTEGER') {
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

export function getOptionsFromBuilder(builder) {
  return builder ? builder.options : [];
}

export function getAutoCompleteHandlersFromBuilder(builder) {
  return builder ? builder.autocompleteHandlers : {};
}
