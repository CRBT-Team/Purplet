import type {
  APICommandAutocompleteInteractionResponseCallbackData,
  APIModalInteractionResponseCallbackData} from 'purplet/types';
import {
  InteractionResponseType,
  MessageFlags,
} from 'purplet/types';
import { Interaction } from './base';
import { OriginalInteractionMessagePartial } from '../message-interaction';
import type {
  CreateInteractionMessageData} from '../resolve/create-message';
import {
  resolveCreateInteractionMessageData,
} from '../resolve/create-message';
import type { JSONResolvable} from '../../utils/json';
import { toJSONValue } from '../../utils/json';

/** Options for `Interaction.deferMessage` */
export interface DeferMessageOptions {
  ephemeral?: boolean;
}

/**
 * @internal Since the rules of what response types are valid for each interaction type are really weird,
 * response functions are implemented as mixins. This file/class is where they are defined.
 *
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type.
 *
 * Mini rant: These docs aren't even fully accurate because it says BS like "`MODAL` is not
 * available for MODAL_SUBMIT and PING interactions", as if `PING` interactions support anything
 * besides `PONG`? Aren't `PING` interactions only supposed to be `PONG`'d. Also, `UPDATE_MESSAGE`
 * is technically valid on a `MODAL_SUBMIT`, but only if it was previously from a component. That is
 * IMPOSSIBLE to type. anyways i think mixins is the best solution we have for the wacky typings.
 *
 * Oh also while im on the topic who came up with `DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE`? i mean it
 * makes sense, but that is a really long name lol.
 */
abstract class InteractionResponseMethods extends Interaction {
  /**
   * Respond to this interaction with a message. Corresponds to the `CHANNEL_MESSAGE_WITH_SOURCE`
   * interaction response type.
   *
   * **Response functions can only be called once per interaction.**
   */
  async showMessage(message: CreateInteractionMessageData) {
    const { message: data, files } = resolveCreateInteractionMessageData(message);
    await this.respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data,
      files,
    });
    return new OriginalInteractionMessagePartial({ id: '@original' }, this);
  }

  /**
   * Defer the resposne to this interaction; sending a message with a loading indicator. Corresponds
   * to the `DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE` interaction response type. Returns the message
   * that was sent, and that must be used to create your actual response.
   *
   * **Response functions can only be called once per interaction.**
   */
  async deferMessage(options?: DeferMessageOptions) {
    // Note: ephemeral is the only thing we can use (well so can suppress embeds, but can't we set those when we edit?)
    await this.respond({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: {
        flags: options?.ephemeral ? MessageFlags.Ephemeral : 0,
      },
    });
    return new OriginalInteractionMessagePartial({ id: '@original' }, this);
  }

  /**
   * Respond to this interaction by updating the message that the targeted component is on.
   * Corresponds to the `UPDATE_MESSAGE` interaction response type. This is only valid for
   * interactions that started from interacting with a message component.
   *
   * **Response functions can only be called once per interaction.**
   */
  async updateMessage(message: CreateInteractionMessageData) {
    const { message: data, files } = resolveCreateInteractionMessageData(message);
    await this.respond({
      type: InteractionResponseType.UpdateMessage,
      data,
      files,
    });
    return new OriginalInteractionMessagePartial({ id: '@original' }, this);
  }

  /**
   * Defer the resposne to this interaction; Does not show a loading indicator, but tells Discord
   * that we acknowledged the interaction. Corresponds to the `DEFERRED_UPDATE_MESSAGE` interaction
   * response type. Returns the message that was sent, and that must be used to create your actual response.
   *
   * **Response functions can only be called once per interaction.**
   */
  async deferUpdateMessage(options?: DeferMessageOptions) {
    // Note: ephemeral is the only thing we can use (well so can suppress embeds, but can't we set those when we edit?)
    await this.respond({
      type: InteractionResponseType.DeferredMessageUpdate,
      data: {
        flags: options?.ephemeral ? MessageFlags.Ephemeral : 0,
      },
    });
    return new OriginalInteractionMessagePartial({ id: '@original' }, this);
  }

  /**
   * Responds with autocomplete options. Corresponds to the
   * `APPLICATION_COMMAND_AUTOCOMPLETE_RESULT` interaction response type. This does not return any data.
   *
   * You typically want to use `OptionBuilder`'s `autocomplete` property, and return data there,
   * instead of manually calling this function.
   *
   * **Response functions can only be called once per interaction.**
   */
  showAutocompleteResponse(
    choices: JSONResolvable<APICommandAutocompleteInteractionResponseCallbackData>
  ) {
    this.respond({
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: {
        choices: toJSONValue(choices),
      },
    });
  }

  /**
   * Shows a modal form to the user. Corresponds to the `MODAL` interaction response type. This does
   * not return any data, and the modal submit is handled as a separate interaction. If you need to
   * pass data from before and after the modal, use purplet's `$modal` hook.
   *
   * **Response functions can only be called once per interaction.**
   */
  showModal(modal: JSONResolvable<APIModalInteractionResponseCallbackData>) {
    this.respond({
      type: InteractionResponseType.Modal,
      data: toJSONValue(modal),
    });
  }
}

/** Here goes all my mixin utilities. */

/** @internal methods added in InteractionResponseMethods */
export type ResponseMethodName = Exclude<keyof InteractionResponseMethods, keyof Interaction>;

/**
 * Mixin helper for adding responses to an interaction. Use in in combination with
 * `createInteractionMixinList` and `applyInteractionResponseMixins`. You'll see these all around.
 *
 * Here is an example:
 *
 * ```ts
 * // Mixin the response methods.
 * const allowedMethods = createInteractionMixinList([
 *   //
 *   'showMessage',
 *   'deferMessage',
 * ]);
 *
 * applyInteractionResponseMixins(WhateverInteraction, allowedMethods);
 * export interface WhateverInteraction<> //
 *   extends InteractionResponseMixin<typeof allowedMethods> {}
 * ```
 *
 * Note you can skip the type parameter and it is still a valid interface.
 *
 * More about mixins: https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern.
 */
export type InteractionResponseMixin<Keys extends readonly ResponseMethodName[]> = Pick<
  InteractionResponseMethods,
  Keys[number]
>;

/**
 * Returns the given argument, which is a typed list of methods from `InteractionResponseMethods`.
 *
 * @see {InteractionResponseMixin} which explains usage.
 */
export function createInteractionMixinList<T extends ResponseMethodName>(list: T[]): T[] {
  return list;
}

/**
 * Applies the given `methods` to `base`
 *
 * @see {InteractionResponseMixin} which explains usage.
 */
export function applyInteractionResponseMixins(base: any, methods: readonly ResponseMethodName[]) {
  methods.forEach(method => {
    base.prototype[method] = InteractionResponseMethods.prototype[method];
  });
}
