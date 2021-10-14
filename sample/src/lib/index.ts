import { MessageEmbed } from "discord.js";

export function formatMessage(text: string) {
  return new MessageEmbed().setDescription(text).setColor("BLURPLE");
}
