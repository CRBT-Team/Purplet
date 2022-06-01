import type { APIApplicationCommandOptionChoice } from 'discord.js';
import type { Choice } from '../lib/builders/OptionBuilder';

export function camelChoiceToSnake<T>(choice: Choice<T>): APIApplicationCommandOptionChoice<T> {
  return {
    name: choice.name,
    value: choice.value,
    name_localizations: choice.nameLocalizations,
  };
}
