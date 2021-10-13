var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// dist/entry.ts
import "dotenv/config";
import { Framework, Handler } from "crbt-framework";

// sample/bot.config.ts
import { ChatCommandHandler, defineConfig } from "crbt-framework";
var bot_config_default = defineConfig({
  compiler: {
    alias: {
      $lib: "./lib"
    }
  },
  handlers: [
    new ChatCommandHandler({
      guilds: ["782584672298729473"]
    })
  ]
});

// sample/modules/hello.ts
var hello_exports = {};
__export(hello_exports, {
  default: () => hello_default
});
import { ChatCommand, OptionBuilder } from "crbt-framework";
var hello_default = ChatCommand({
  name: "daveping",
  description: "A cool command",
  options: new OptionBuilder().enum("animal", "The type of animal", [
    { name: "Dog", value: "animal_dog" },
    { name: "Cat", value: "animal_cat" },
    { name: "Penguin", value: "animal_penguin" }
  ], false),
  handle(x) {
    this.reply(`Hello ${x.animal ?? "world"}`);
  }
});

// dist/entry.ts
var modules = {
  m0: hello_exports
};
var handlers = [].flatMap((x) => Object.values(x)).filter((x) => x.constructor instanceof Handler.constructor).map((x) => new x());
(async () => {
  const conf = await bot_config_default;
  bot_config_default.handlers = (bot_config_default.handlers ?? []).concat(...handlers);
  const bot = new Framework(conf);
  bot.addModules(modules);
  bot.init();
})();
