import path from 'path';

export type Validator<T = any> = (input: T, keypath: string) => T;

let currentBasePath: string | undefined;

export function setValidatorBasePath(filepath: string) {
  currentBasePath = filepath;
}

export function object(children: Record<string, Validator>, allow_unknown = false): Validator {
  return (input, keypath) => {
    const output: Record<string, any> = {};

    if ((input && typeof input !== 'object') || Array.isArray(input)) {
      throw new Error(`${keypath} should be an object`);
    }

    for (const key in input) {
      if (!(key in children)) {
        if (allow_unknown) {
          output[key] = input[key];
        } else {
          throw new Error(`Unexpected option ${keypath}.${key}`);
        }
      }
    }

    for (const key in children) {
      const validator = children[key];
      output[key] = validator(input && input[key], `${keypath}.${key}`);
    }

    return output;
  };
}

export function validate<T>(fallback: T, fn: Validator<T>): Validator {
  return (input, keypath) => fn(input === undefined ? fallback : input, keypath);
}

export function string(fallback: string | null, allow_empty = true): Validator {
  return validate(fallback, (input, keypath) => {
    assert_string(input, keypath);

    if (!allow_empty && input === '') {
      throw new Error(`${keypath} cannot be empty`);
    }

    return input;
  });
}

export function string_array(fallback: string[] | undefined): Validator {
  return validate(fallback, (input, keypath) => {
    if (input === undefined) {
      return input;
    }

    if (!Array.isArray(input) || input.some(value => typeof value !== 'string')) {
      throw new Error(`${keypath} must be an array of strings, if specified`);
    }

    return input;
  });
}

export function number(fallback: number): Validator {
  return validate(fallback, (input, keypath) => {
    if (typeof input !== 'number') {
      throw new Error(`${keypath} should be a number, if specified`);
    }
    return input;
  });
}

/**
 * @param {boolean} fallback
 *
 * @returns {Validator}
 */
export function boolean(fallback: boolean): Validator {
  return validate(fallback, (input, keypath) => {
    if (typeof input !== 'boolean') {
      throw new Error(`${keypath} should be true or false, if specified`);
    }
    return input;
  });
}

export function list(options: string[], fallback = options[0]): Validator {
  return validate(fallback, (input, keypath) => {
    if (!options.includes(input)) {
      // prettier-ignore
      const msg = options.length > 2
        ? `${keypath} should be one of ${options.slice(0, -1).map(i => `"${i}"`).join(', ')} or "${options[options.length - 1]}"`
        : `${keypath} should be either "${options[0]}" or "${options[1]}"`;

      throw new Error(msg);
    }
    return input;
  });
}

export function assert_string(input: any, keypath: string) {
  if (typeof input !== 'string') {
    throw new Error(`${keypath} should be a string, if specified`);
  }
}

export function error(fn: (keypath?: string) => string) {
  return validate(undefined, (input: any, keypath: string) => {
    if (input !== undefined) {
      throw new Error(fn(keypath));
    }
  });
}

export function pathname(fallback: string): Validator {
  return validate(fallback, (input, keypath) => {
    assert_string(input, keypath);

    if (input === '') {
      throw new Error(`${keypath} cannot be empty`);
    }

    return path.resolve(currentBasePath ?? '/', input);
  });
}
