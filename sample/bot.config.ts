import { ChatCommandHandler, defineConfig } from "crbt-framework";

export default defineConfig({
  compiler: {
    alias: {
      $lib: "./lib",
    },
  },
  handlers: [
    new ChatCommandHandler({
      guilds: ["782584672298729473"],
    }),
  ],
});
