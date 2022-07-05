import type { APIApplicationCommandOptionChoice } from 'purplet/types';
import type { Choice } from '../builders';

export function camelChoiceToSnake<T>(choice: Choice<T>): APIApplicationCommandOptionChoice<T> {
  return {
    name: choice.name,
    value: choice.value,
    name_localizations: choice.nameLocalizations,
  };
}
