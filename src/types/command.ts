import { CommandInteraction } from "discord.js";

export interface Choices {
  name: string;
  value: string;
}

export interface CommandOptions {
  name: string;
  description: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'INTEGER' | 'MENTIONABLE' | 'CHANNEL' | 'USER' | 'ROLE' | 'SUB_COMMAND';
  required?: boolean;
  choices?: Choices[];
  options?: CommandOptions[];
}

export interface SubCommand {
  name: string;
  description: string;
  options: CommandOptions[];
}

export interface Command {
  name: String;
  description: String;
  options: CommandOptions[] | SubCommand[];
  execute(interaction: CommandInteraction): Promise<unknown> | void;
}

export function command(options: Command): Promise<unknown> | void {
  
}