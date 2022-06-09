import type { Class } from '@davecode/types';
import type { APIInteraction } from 'discord-api-types/v10';
import { AutocompleteInteraction } from './autocomplete';
import type { Interaction, InteractionResponseHandler } from './base';
import { ChatCommandInteraction } from './command-chat';
import { MessageCommandInteraction } from './command-message';
import { UserCommandInteraction } from './command-user';
import { ButtonInteraction } from './component-button';
import { SelectMenuInteraction } from './component-select';
import { ModalSubmitInteraction } from './modal-submit';

export * from './autocomplete';
export * from './base';
export * from './command';
export * from './command-chat';
export * from './command-context';
export * from './command-message';
export * from './command-user';
export * from './component';
export * from './component-button';
export * from './component-select';
export * from './modal-submit';

type Matchable = Class<Interaction> & {
  matches(i: APIInteraction): i is APIInteraction;
};

const classes: Matchable[] = [
  ChatCommandInteraction,
  UserCommandInteraction,
  MessageCommandInteraction,
  AutocompleteInteraction,
  ButtonInteraction,
  SelectMenuInteraction,
  ModalSubmitInteraction,
];

export function createInteraction(
  raw: APIInteraction,
  responseHandler: InteractionResponseHandler
): Interaction {
  const Subclass = classes.find(c => c.matches(raw));
  if (!Subclass) {
    throw new Error(`No matching Interaction for passed APIInteraction: ${JSON.stringify(raw)}`);
  }
  return new Subclass(raw, responseHandler);
}