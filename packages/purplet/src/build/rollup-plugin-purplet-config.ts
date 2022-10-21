import type { Plugin } from "rollup";
import { ResolvedConfig, RUNTIME_CONFIG_KEYS } from "../config/types";
import dynamicVirtual from "./rollup-plugin-dynamic-virtual";

/**
 * Provides `$build/config`
 */
export function pluginConfig(config: ResolvedConfig): Plugin {
  const runtimeConfig = {} as any;
  for (const key of RUNTIME_CONFIG_KEYS) {
    runtimeConfig[key] = config[key];
  }

  return {
    ...dynamicVirtual([
      {
        match: /^\$\$config$/,
        load: () => `export default ${JSON.stringify(runtimeConfig)}`
      },
    ]),
    name: "purplet/plugin-config",
  };
}
