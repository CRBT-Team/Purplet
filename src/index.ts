export * from "./OptionBuilder";
export * from "./ChatCommand";
export * from "./Config";
export * from "./Handler";
export * from "./Framework";

// run the cli module if this is run directly

import path from "path";
if (path.resolve(import.meta.url.replace(/file:\/+/, "")) === process.argv[1]) {
  import("./cli");
}
