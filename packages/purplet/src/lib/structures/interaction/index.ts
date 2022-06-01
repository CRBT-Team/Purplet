import type { Class } from '@davecode/types';
import type { APIInteraction } from 'discord.js';
import { PurpletAutocompleteInteraction } from './autocomplete';
import type { InteractionResponseHandler, PurpletInteraction } from './base';
import { PurpletChatCommandInteraction } from './command-chat';
import { PurpletMessageCommandInteraction } from './command-message';
import { PurpletUserCommandInteraction } from './command-user';
import { PurpletButtonInteraction } from './component-button';
import { PurpletSelectMenuInteraction } from './component-select';
import { PurpletModalSubmitInteraction } from './modal-submit';

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

type Matchable = Class<PurpletInteraction> & {
  matches(i: APIInteraction): i is APIInteraction;
};

const classes: Matchable[] = [
  PurpletChatCommandInteraction,
  PurpletUserCommandInteraction,
  PurpletMessageCommandInteraction,
  PurpletAutocompleteInteraction,
  PurpletButtonInteraction,
  PurpletSelectMenuInteraction,
  PurpletModalSubmitInteraction,
];

export function createInteraction(
  raw: APIInteraction,
  responseHandler: InteractionResponseHandler
): PurpletInteraction {
  const Subclass = classes.find(c => c.matches(raw));
  if (!Subclass) {
    throw new Error(
      `No matching PurpletInteraction for passed APIInteraction: ${JSON.stringify(raw)}`
    );
  }
  return new Subclass(raw, responseHandler);
}
