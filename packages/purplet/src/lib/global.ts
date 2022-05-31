import { REST } from '@discordjs/rest';
import type { Client } from 'discord.js';

/** Global REST client from `@discordjs/rest`. */
export const rest = new REST();

export let djs: Client;

export function setDJSClient(newDJS: Client) {
  djs = newDJS;
}
