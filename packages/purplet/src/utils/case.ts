import type { Choice } from '@purplet/builders';
import type { APIApplicationCommandOptionChoice } from 'purplet/types';

export function camelChoiceToSnake<T>(choice: Choice<T>): APIApplicationCommandOptionChoice<T> {
  return {
    name: choice.name,
    value: choice.value,
    name_localizations: choice.nameLocalizations,
  };
}

export function camelCaseToEnumCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
}
