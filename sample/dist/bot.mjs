var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// dist/entry.mjs
import { Purplet, Handler, setupEnv } from "purplet";

// sample/purplet.config.ts
import { ChatCommandHandler, defineConfig } from "purplet";
var purplet_config_default = defineConfig({
  discord: {
    commandGuilds: ["782584672298729473"]
  },
  handlers: [new ChatCommandHandler()]
});

// sample/src/modules/hello.ts
var hello_exports = {};
__export(hello_exports, {
  default: () => hello_default
});

// sample/src/lib/index.ts
import { MessageEmbed } from "discord.js";
function formatMessage(text) {
  return new MessageEmbed().setDescription(text).setColor("BLURPLE");
}

// sample/src/modules/hello.ts
import { ChatCommand, OptionBuilder } from "purplet";
var hello_default = ChatCommand({
  name: "hello",
  description: "A cool command",
  options: new OptionBuilder().enum("who", "Say hello to who?", {
    option1: "Option 1",
    option2: "Option 2"
  }, false),
  handle({ who }) {
    this.reply({
      embeds: [formatMessage(`Hello ${who ?? "World"}}!`)]
    });
  }
});

// dist/entry.mjs
setupEnv();
var modules = {
  m0: hello_exports
};
(async () => {
  const conf = await purplet_config_default;
  const bot = new Purplet(conf);
  bot.addModules(modules);
  bot.init();
})();
//# sourceMappingURL=bot.mjs.map
