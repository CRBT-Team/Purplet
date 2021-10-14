export * from "./util/OptionBuilder";
export * from "./handlers/ChatCommand";
export * from "./Config";
export * from "./Handler";
export * from "./Purplet";

// run the cli module if this is run directly

import path from "path";
if (path.resolve(import.meta.url.replace(/file:\/+/, "")) === process.argv[1]) {
  import("./cli");
}
