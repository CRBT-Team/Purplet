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
        ...opts,
      };

      if (obj.required === undefined) {
        obj.required = false;
      }

      if (opts.autocomplete) {
        this.autocompleteHandlers[name] = opts.autocomplete;
        obj.autocomplete = true;
      }

      if (opts.choices) {
        obj.choices = Object.entries(opts.choices).map(([value, name]) => {
          // value may be converted to string, undo that:
          if (type === 'NUMBER' || type === 'INTEGER') {
            value = Number(value);
          }

          return {
            name,
            nameLocalizations: opts.choiceLocalizations?.[key] ?? undefined,
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
}

export function getOptionsFromBuilder(builder) {
  return builder ? builder.options : [];
}

export function getAutoCompleteHandlersFromBuilder(builder) {
  return builder ? builder.autocompleteHandlers : {};
}
