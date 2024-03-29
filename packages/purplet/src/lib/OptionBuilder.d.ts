import type { Awaitable, Class, EmptyObject, ForceSimplify, Overwrite } from '@paperdave/utils';
import type {
  APIApplicationCommandOption,
  APIAttachment,
  ApplicationCommandOptionType,
  ChannelType,
  LocalizationMap,
} from 'discord-api-types/payloads';

/**
 * OptionBuilder is a very complex piece of type-code built out of a lot of mapped types to reduce
 * the amount of copied code. The reasoning for all of this is to give a nice interface to users by
 * keeping track of EVERYTHING passed to it in the `<Options>` type param, which can be extracted
 * later, giving you strong types inside of `$slashCommand` and other places.
 *
 * The first type `OptionInputs` is an interfaces mapping method names to their respective `options`
 * argument (third one where first is `name` and second is `description`). All of these inputs
 * extend other interfaces according to the discord api, but with camel case instead of snake case.
 */

/**
 * @internal Maps builder method names to what the third argument should be. When editing this, you
 * must ensure the keys match to discord option type names. See the assertion type below for if that
 * check is met.
 */
interface OptionInputs {
  string: StringOption;
  integer: NumericOption;
  boolean: BaseOption;
  channel: ChannelOption;
  user: BaseOption;
  mentionable: BaseOption;
  role: BaseOption;
  number: NumericOption;
  attachment: BaseOption;
}

/** @internal This type MUST only be equal to "PASS", if it includes "FAIL" then the above type is incorrect. */
type AssertOptionInputsCorrect = //
  typeof ApplicationCommandOptionType[Capitalize<keyof OptionInputs>] extends number
    ? 'PASS'
    : 'FAIL';

/** @internal Used for `OptionInputs`. Hold the common properties of all options. */
interface BaseOption {
  nameLocalizations?: LocalizationMap;
  descriptionLocalizations?: LocalizationMap;
}

/** @internal Used for `OptionInputs`. This option has an autocomplete handler. */
interface AutocompleteOption<T extends string | number> extends BaseOption {
  autocomplete?: Autocomplete<null, T>;
}

/**
 * @internal Used for `OptionInputs`. Enum Options as I call them are anything with a dropdown list.
 * In Discord, this is done with a `choices` list or `autocomplete` handler.
 */
export type EnumOption<T extends string | number> =
  | AutocompleteOption<T>
  | ({
      // Look at this: it's an object, NOT an array. Personal opinion tbh, looks cleaner.
      choices: Record<T, string>;
      choiceLocalizations?: Record<T, LocalizationMap>;
    } & BaseOption);

/** @internal Used for `OptionInputs`. Numeric options have a min and max value, in addition to being enum-able. */
interface NumericOption extends EnumOption<number> {
  minValue?: number;
  maxValue?: number;
}

/** @internal Used for `OptionInputs`. String options have a min and max length, in addition to being enum-able. */
interface StringOption extends EnumOption<number> {
  minLength?: number;
  maxLength?: number;
}

/** @internal Used for `OptionInputs`. Channels have a channel type limit, but are otherwise basic options. */
interface ChannelOption extends BaseOption {
  channelTypes?: ChannelType[];
}

/**
 * The rest of the option types are BaseOption, as they have no extra properties. (like `role`)
 *
 * Next up are a few utility types for stuff youre passing to the builder for choices and autocomplete.
 */

/** Represents one choice from a `.choices` object or return from an autocomplete handler. */
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
export type Autocomplete<Context = null, Type = unknown> = (
  this: AutocompleteInteraction,
  ctx: Context
) => Awaitable<Array<Choice<Type>>>;

/**
 * @internal Transforms { autocomplete?: Autocomplete<null, T> } to fill that `null`. This type exists so we
 * don't have to pass `CurrentOptions` and `Key` through to each thing in `OptionInputs`
 */
type TransformAutocompleteOptions<T, CurrentOptions, Key> = //
  T extends AutocompleteOption<infer ACType>
    ? Overwrite<
        T,
        {
          autocomplete?: Autocomplete<
            ForceSimplify<
              Partial<OptionBuilderToUnresolvedObject<CurrentOptions> & Record<Key, ACType>>
            >,
            ACType
          >;
        }
      >
    : T;

/**
 * Now, for building the actual OptionBuilder instance type. We simply map over the keys of the
 * inputs with an `OptionBuilderMethod`. This is also one of our exported types, so the main tsdoc
 * is right here.
 */

/**
 * `OptionBuilder` is an advanced builder class for `CHAT_INPUT` command's `options` property,
 * keeping track of all the options you pass to it in a type parameter, which is extracted by
 * `$slashCommand` to give you rich option types.
 */
export type OptionBuilder<Options = EmptyObject> = {
  /** Append an option. */
  [Type in keyof OptionInputs]: OptionBuilderMethod<Options, Type>;
} & {
  /** Converts the builder into an `APIApplicationCommandOption[]`, suitible to be sent to the Discord API. */
  toJSON(): APIApplicationCommandOption[];
};

/**
 * @internal Given an object of our current options `CurrentOptions` and the method name `MethodName`, resolve
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
  OptionOptions extends TransformAutocompleteOptions<OptionInputs[MethodName], CurrentOptions, Key>,
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
           * Normal options are resolved to `ApplicationCommandOptionType.MethodName` except when
           * its an enum type, where instead it's just that value.
           */
          OptionOptions['choices'] extends Record<infer K, string>
            ? string | number extends K
              ? typeof ApplicationCommandOptionType[Capitalize<MethodName>]
              : K
            : typeof ApplicationCommandOptionType[Capitalize<MethodName>]
        >
      >
  >
>;

/** @internal If `If` is false, then `T` is returned as a partial, otherwise it is returned as normal. */
type RequiredIf<If, T> = If extends false ? Partial<T> : T;

// the actual class definition
export const OptionBuilder: Class<OptionBuilder>;

/** Extract the Record<string, Autocomplete> out of an OptionBuilder. */
export function getOptionBuilderAutocompleteHandlers(
  builder: OptionBuilder | undefined
): Record<string, Autocomplete>;

/** Now here are types for resolving the OptionBuilder's type param to more useful structures. */

type OptionBuilderOrType<T> = OptionBuilder<T> | T;

/** "Unresolved" refers to the raw `value` property given in an interaction. */
export type OptionBuilderEntryToUnresolved<X> = X extends ApplicationCommandOptionType
  ? {
      [ApplicationCommandOptionType.String]: string;
      [ApplicationCommandOptionType.Integer]: number;
      [ApplicationCommandOptionType.Boolean]: boolean;
      [ApplicationCommandOptionType.User]: BareUser;
      [ApplicationCommandOptionType.Channel]: string;
      [ApplicationCommandOptionType.Role]: string;
      [ApplicationCommandOptionType.Mentionable]: string;
      [ApplicationCommandOptionType.Number]: number;
      [ApplicationCommandOptionType.Attachment]: string;
    }[X]
  : X;
/** "Unresolved" refers to the raw `value` property given in an interaction. */
export type OptionBuilderToUnresolvedObject<X> = X extends OptionBuilderOrType<infer T>
  ? { [K in keyof T]: OptionBuilderEntryToUnresolved<T[K]> }
  : never;
/** "PurpletResolved" is used for the object passed to SlashCommandData.handle. */
export type OptionBuilderEntryToPurpletResolved<X> = X extends ApplicationCommandOptionType
  ? {
      [ApplicationCommandOptionType.String]: string;
      [ApplicationCommandOptionType.Integer]: number;
      [ApplicationCommandOptionType.Boolean]: boolean;
      [ApplicationCommandOptionType.User]: InteractionUser;
      [ApplicationCommandOptionType.Channel]: APIInteractionDataResolvedChannel;
      [ApplicationCommandOptionType.Role]: APIRole;
      [ApplicationCommandOptionType.Mentionable]: APIUser | APIRole;
      [ApplicationCommandOptionType.Number]: number;
      [ApplicationCommandOptionType.Attachment]: APIAttachment;
    }[X]
  : X;
/** "PurpletResolved" is used for the object passed to SlashCommandData.handle. */
export type OptionBuilderToPurpletResolvedObject<X> = X extends OptionBuilderOrType<infer T>
  ? { [K in keyof T]: OptionBuilderEntryToPurpletResolved<T[K]> }
  : never;
