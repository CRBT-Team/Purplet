var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// .purplet/entry.ts
import "dotenv/config";
import { Framework, Handler } from "purplet";

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
import { ChatCommand, OptionBuilder } from "purplet";

// sample/src/lib/index.ts
import { MessageEmbed } from "discord.js";
function formatMessage(text) {
  return new MessageEmbed().setDescription(text).setColor("BLURPLE");
}

// sample/src/modules/hello.ts
var hello_default = ChatCommand({
  name: "hello",
  description: "A cool command",
  options: new OptionBuilder().string("who", "Say hello to who?", false),
  handle({ who }) {
    this.reply({
      embeds: [formatMessage(`Hello ${who ?? "World"}}!`)]
    });
  }
});

// .purplet/entry.ts
var modules = {
  m0: hello_exports
};
var handlers = [].flatMap((x) => Object.values(x)).filter((x) => x.constructor instanceof Handler.constructor).map((x) => new x());
(async () => {
  const conf = await purplet_config_default;
  purplet_config_default.handlers = (purplet_config_default.handlers ?? []).concat(...handlers);
  const bot = new Framework(conf);
  bot.addModules(modules);
  bot.init();
})();
