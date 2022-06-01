/* eslint-disable no-redeclare */
import type { Awaitable, Class, ForceSimplify } from '@davecode/types';
import {
  APIApplicationCommandOption,
  APIAttachment,
  APIInteractionDataResolvedChannel,
  APIRole,
  APIUser,
  ChannelType,
  LocalizationMap,
} from 'discord.js';
import type { PurpletAutocompleteInteraction } from '../interaction';

/**
 * (Explainer part 1 of 2)
 *
 * OptionBuilder is built out of a lot of mapped types, to reduce the amount of copied code. This
 * builder is special because it keeps track of EVERYTHING passed to it in a type parameter, which
 * can be extracted later, giving you strong types inside of `$chatCommand`.
 *
 * The first two types, `OptionInputs` and `OptionOutputs` are interfaces mapping method names to
 * their respective input and output. "Input" in this case refers to the third argument, containing
 * options after name and description. All of these inputs extend other interfaces according to the
 * discord api, but with camel case names. "Output" refers to the resolved data types.
 */

/** @internal Maps builder method names to what the third argument should be. */
interface OptionInputs<ThisKey = string, ExistingOptions = null> {
  string: EnumOption<ThisKey, ExistingOptions, string>;
  integer: NumericOption<ThisKey, ExistingOptions>;
  boolean: BaseOption;
  channel: ChannelOption;
  user: BaseOption;
  mentionable: BaseOption;
  role: BaseOption;
  number: NumericOption<ThisKey, ExistingOptions>;
  attachment: BaseOption;
}

/** @internal Maps builder method names to what the option resolves to. */
interface OptionTypeValues {
  string: string;
  integer: number;
  boolean: boolean;
  channel: APIInteractionDataResolvedChannel;
  user: APIUser;
  mentionable: APIUser | APIRole;
  role: APIRole;
  number: number;
  attachment: APIAttachment;
}

/** @internal Used for `OptionInputs`. Hold the common properties of all options. */
interface BaseOption {
  nameLocalizations?: LocalizationMap;
  descriptionLocalizations?: LocalizationMap;
}

/** @internal Used for `OptionInputs`. This option has an autocomplete handler */
interface AutocompleteOption<ThisKey, ExistingOptions, T> extends BaseOption {
  autocomplete?: Autocomplete<Partial<ExistingOptions> & Record<ThisKey, T>, T>;
}

/**
 * @internal Used for `OptionInputs`. Enum Options as I call them are anything with a dropdown list.
 * In Discord, this is done with a `choices` list or `autocomplete` handler.
 */
type EnumOption<ThisKey, ExistingOptions, T> =
  | AutocompleteOption<ThisKey, ExistingOptions, T>
  | (BaseOption & {
      // Look at this: it's an object, NOT an array. Personal opinion tbh, looks cleaner.
      choices: Record<T, string>;
      choiceLocalizations?: Record<T, LocalizationMap>;
    });

/** @internal Used for `OptionInputs`. Numeric options have a min and max value, in addition to being enum-able. */
interface NumericOption<ThisKey, ExistingOptions>
  extends EnumOption<ThisKey, ExistingOptions, number> {
  minValue?: number;
  maxValue?: number;
}

/** @internal Used for `OptionInputs`. Channels have a channel type limit, but are otherwise basic options. */
interface ChannelOption extends BaseOption {
  channelTypes?: ChannelType[];
}

/**
 * The rest of the option types are BaseOption, as they have no extra properties.
 *
 * Next up are a few utility types for stuff youre passing to the builder for choices and autocomplete.
 */

/** Represents one choice from a `.choices` object. */
export interface Choice<T = string | number> {
  name: string;
  nameLocalizations?: LocalizationMap;
  value: T;
}

/**
 * Represents an option autocomplete handler passed to `.autocomplete` on an option builder's
 * options argument. This function gets called on autocomplete interactions tied to whatever command
 * option you pass it to.
 */
export type Autocomplete<ExistingOptions = Record<string, never>, Type = unknown> = (
  this: PurpletAutocompleteInteraction,
  ctx: ExistingOptions
) => Awaitable<Choice<Type>[]>;

/**
 * Now, for building the actual OptionBuilder instance type. We simply map over the keys of the
 * inputs with an `OptionBuilderMethod`. This is also one of our exported types, so the main tsdoc
 * is right here.
 */

/**
 * `OptionBuilder` is an advanced builder class for `CHAT_INPUT` command's `options` property,
 * keeping track of all the options you pass to it in a type parameter, which is extracted by
 * `$chatCommand` to give you rich option types.
 */
export type OptionBuilder<Options = {}> = {
  /** Append an option. */
  [Type in keyof OptionInputs]: OptionBuilderMethod<Options, Type>;
} & {
  /** Converts the builder into an `APIApplicationCommandOption[]`, suitible to be sent to the Discord API. */
  toJSON(): APIApplicationCommandOption[];
};

/**
 * Given an object of our current options `CurrentOptions` and the method name `MethodName`, resolve
 * to a method with three type parameters, which all get inferred by its usage.
 */
type OptionBuilderMethod<CurrentOptions, MethodName extends keyof OptionInputs> = <
  /** `Key` will match the first argument, any string for the option name. */
  Key extends string,
  /**
   * `OptionOptions` will match the third argument, the options that this option gets, as defined
   * from `OptionInputs` up above. We also pass it the `ThisKey` and `ExistingOptions` params, which
   * are only really used for the `autocomplete` method.
   */
  OptionOptions extends OptionInputs<Key, CurrentOptions>[MethodName],
  /**
   * `IsRequired` is a boolean that will match the extra { required?: boolean } object we join
   * `OptionOptions` with, as we perform different type behavior based on whether or not it's
   * required or not.
   */
  IsRequired extends boolean = false
>(
  key: Key,
  desc: string,
  options?: OptionOptions & { required?: IsRequired }
) => OptionBuilder<
  /**
   * The new property is the current options joined with the new option. The `RequiredIf` helper
   * type converts the new Record into a partial if `required` is set to false.
   */
  ForceSimplify<
    CurrentOptions &
      RequiredIf<
        IsRequired,
        Record<
          Key,
          /**
           * Here, we need to resolve EnumOptions, aka stuff with a choice array. I'll be honest, I
           * do not know why we need that extra `T extends string` check, but it breaks everything
           * if I remove it, so ¯＼_(ツ)_/¯
           */
          OptionOptions extends EnumOption<unknown, unknown, infer T>
            ? T extends string
              ? T
              : OptionTypeValues[MethodName]
            : OptionTypeValues[MethodName]
        >
      >
  >
>;

/** If `If` is false, then `T` is returned as a partial, otherwise it is returned as normal. */
type RequiredIf<If, T> = If extends false ? Partial<T> : T;

// the actual class definition
export const OptionBuilder: Class<OptionBuilder>;

/** Extract the Record<string, Autocomplete> out of an OptionBuilder. */
export function getOptionBuilderAutocompleteHandlers(
  builder: OptionBuilder | undefined
): Record<string, Autocomplete>;

/** Utility type to extract the option types out of an `OptionBuilder` */
export type GetOptionsFromBuilder<T extends OptionBuilder> = T extends OptionBuilder<infer U>
  ? U
  : never;
