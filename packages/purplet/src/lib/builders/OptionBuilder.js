// be careful changing this file

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

  string = this.#createOption('STRING');
  integer = this.#createOption('INTEGER');
  boolean = this.#createOption('BOOLEAN');
  channel = this.#createOption('CHANNEL');
  user = this.#createOption('USER');
  mentionable = this.#createOption('MENTIONABLE');
  role = this.#createOption('ROLE');
  number = this.#createOption('NUMBER');
  attachment = this.#createOption('ATTACHMENT');

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
