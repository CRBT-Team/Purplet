var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// dist/entry.ts
import { Framework } from "crbt-framework";

// dist/all-modules.ts
var all_modules_exports = {};
__export(all_modules_exports, {
  module_hello: () => hello_exports
});

// sample/modules/hello.ts
var hello_exports = {};
__export(hello_exports, {
  default: () => hello_default
});
import { ChatCommand, OptionBuilder } from "crbt-framework";
var hello_default = ChatCommand({
  name: "hello",
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

// sample/bot.config.ts
var bot_config_exports = {};
__export(bot_config_exports, {
  default: () => bot_config_default
});
import { defineConfig } from "crbt-framework";
var bot_config_default = defineConfig({});

// dist/entry.ts
import "dotenv/config";
var bot = new Framework(bot_config_exports);
bot.addModules(all_modules_exports);
bot.init();
