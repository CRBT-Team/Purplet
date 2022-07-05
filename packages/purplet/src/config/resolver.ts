import path from 'path';
import def from './default';
import type { Config, ResolvedConfig } from './types';
import { assert_string, object, pathname, string, validate } from './validators';

export function resolveConfig(root: string, config: Config): ResolvedConfig {
  if (typeof config !== 'object') {
    throw new Error(
      'purplet.config.ts must have a configuration object as its default export. See https://purplet.js.org/docs/configuration'
    );
  }

  return {
    ...options(config, 'config'),
    root,
    temp: path.join(root, '.purplet'),
  };
}

const options = object({
  alias: validate<ResolvedConfig['alias']>(def.alias, (input, keypath) => {
    if (typeof input !== 'object' || !input) {
      throw new Error(`${keypath} should be an object`);
    }

    input = { ...def.alias, ...input };

    for (const key in input) {
      assert_string(input[key], `${keypath}.${key}`);

      if (key.startsWith('./') || key.startsWith('../') || key.startsWith('/')) {
        throw new Error(`${keypath} keys cannot start with './', '../' or '/' — saw '${key}'`);
      }
      if (key.endsWith('/')) {
        throw new Error(`${keypath} keys cannot end with '/' — saw '${key}'`);
      }
      if (input[key].endsWith('/') || input[key].endsWith('/*')) {
        throw new Error(`${keypath}.${key} cannot end with '/*' or '/'`);
      }
    }

    return input;
  }),
  lang: string(def.lang, false),
  paths: object({
    build: pathname(def.paths.build),
    features: pathname(def.paths.features),
    translations: pathname(def.paths.translations),
  }),
  vite: validate(
    () => ({}),
    (input, keypath) => {
      if (typeof input === 'object') {
        const config = input;
        input = () => config;
      }

      if (typeof input !== 'function') {
        throw new Error(
          `${keypath} must be a Vite config object (https://vitejs.dev/config) or a function that returns one`
        );
      }

      return input;
    }
  ),
});
