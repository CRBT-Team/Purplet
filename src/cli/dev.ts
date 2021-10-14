import path from "path";
import { loadConfig } from "./load-config";
import { PurpletDevelopment } from "../PurpletDevelopment";
import type { Args } from ".";

export async function dev(args: Args) {
  const config = await loadConfig(args);

  console.log("Development mode is unfinished, and does not fully work.");
  const framework = new PurpletDevelopment(config);
}
