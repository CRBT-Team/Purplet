import { Command } from "../types/command";
import CommandOption from "../classes/options";
import { CommandInteraction } from "discord.js";

export = {
  name: 'user',
  description: `Get any kind of info about a user.`,
  options: [
    {
      name: 'user',
      description: 'The user to get info about.',
      type: 'STRING',
      required: true,
    }
  ],
  async execute(i: CommandInteraction) {
    i.reply({
      content: "hello"
    });
  },
} as Command;