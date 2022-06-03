import type { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
import type { Choice } from '../builders';

export function camelChoiceToSnake<T>(choice: Choice<T>): APIApplicationCommandOptionChoice<T> {
  return {
    name: choice.name,
    value: choice.value,
    name_localizations: choice.nameLocalizations,
  };
}
