import type { Config, ResolvedConfig } from "./types";
import { string, assert_string, object, validate, pathname } from "./validators";
import def from './default';

export function resolveConfig(config: Config): ResolvedConfig {
  if (typeof config !== 'object') {
    throw new Error(
      'purplet.config.ts must have a configuration object as its default export. See https://purplet.js.org/docs/configuration'
    );
  }


  return options(config, 'config');
}

const options = object({
  alias: validate<ResolvedConfig['alias']>(def.alias, (input, keypath) => {
    if (typeof input !== 'object' || !input) {
      throw new Error(`${keypath} should be an object`);
    }

    input = { ...def.alias, ...input };

    for (const key in input) {
      assert_string(input[key], `${keypath}.${key}`);
    }

    return input;
  }),
  lang: string(def.lang, false),
  paths: object({
    build: pathname(def.paths.build),
    features: pathname(def.paths.features),
    temp: pathname(def.paths.temp),
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
  )
});
