import type { Args } from ".";
import { loadConfig } from "./load-config";

export async function build(args: Args) {
  const config = await loadConfig(args);
  console.log(config);
}
