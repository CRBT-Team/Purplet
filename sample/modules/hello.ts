import { ChatCommand, OptionBuilder } from "crbt-framework";

export default ChatCommand({
  name: "daveping",
  description: "A cool command",
  options: new OptionBuilder().enum(
    "animal",
    "The type of animal",
    [
      { name: "Dog", value: "animal_dog" },
      { name: "Cat", value: "animal_cat" },
      { name: "Penguin", value: "animal_penguin" },
    ] as const,
    false
  ),
  handle(x) {
    this.reply(`Hello ${x.animal ?? "world"}`);
  },
});
