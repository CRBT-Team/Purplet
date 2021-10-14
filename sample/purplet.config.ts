import { ChatCommandHandler, defineConfig } from "purplet";

export default defineConfig({
  discord: {
    commandGuilds: ["782584672298729473"],
  },
  handlers: [new ChatCommandHandler()],
});
