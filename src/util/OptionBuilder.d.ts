import {
  ApplicationCommandOption,
  AutocompleteInteraction,
  Channel,
  ChannelTypes,
  LocalizationMap,
  MessageAttachment,
  Role,
  User,
} from 'discord.js';
import { Class, MaybePromise } from './types';

// The reason we are passing ExistingOptions around is just for `autocomplete`
export interface OptionTypes<ThisKey = string, ExistingOptions = null> {
  string: EnumOption<ThisKey, ExistingOptions, string>;
  integer: NumericOption<ThisKey, ExistingOptions>;
  boolean: BaseOption<boolean>;
  channel: ChannelOption;
  user: BaseOption<User>;
  mentionable: BaseOption<User | Role>;
  role: BaseOption<Role>;
  number: NumericOption<ThisKey, ExistingOptions>;
  attachment: BaseOption<MessageAttachment>;
}

type HIDDEN = unique symbol;

interface BaseOption<T> {
  [HIDDEN]?: T;
  nameLocalizations?: LocalizationMap;
  descriptionLocalizations?: LocalizationMap;
}

interface AutocompleteOption<ThisKey, ExistingOptions, T> extends BaseOption<T> {
  autocomplete?: Autocomplete<Partial<ExistingOptions> & Record<ThisKey, T>, T>;
}

type EnumOption<ThisKey, ExistingOptions, T extends PropertyKey> =
  | AutocompleteOption<ThisKey, ExistingOptions, T>
  | (BaseOption<T> & {
      choices: Record<T, string>;
      choiceLocalizations?: Record<T, Record<string, string>>;
    });

interface NumericOption<ThisKey, ExistingOptions>
  extends AutocompleteOption<ThisKey, ExistingOptions, number> {
  minValue?: number;
  maxValue?: number;
}

interface ChannelOption extends BaseOption<Channel> {
  channelTypes?: ChannelTypes[];
}

export interface Choice<T> {
  name: string;
  nameLocalizations?: LocalizationMap;
  value: T;
}

type GetOptionType<Option> = Option extends ChannelOption
  ? Channel
  : Option extends BaseOption<infer T>
  ? T extends string | number | boolean | Channel | User | Role
    ? T
    : Option extends EnumOption<infer K, infer E, infer T>
    ? T
    : never
  : never;

/** Function representing an autocomplete handler. */
export type Autocomplete<ExistingOptions = Record<string, never>, Type = unknown> = (
  this: AutocompleteInteraction,
  ctx: ExistingOptions
) => MaybePromise<Choice<Type>[]>;

// we use a private type here so we can use the [x in y] syntax
type IOptionBuilder<Options = Record<string, never>> = {
  [Type in keyof OptionTypes]: OptionBuilderMethod<Options, Type>;
};

type OptionBuilderMethod<Options, Type extends keyof OptionTypes> = <
  Key extends string,
  OptionOptions extends OptionTypes<Key, Options>[Type],
  IsRequired extends boolean = true
>(
  key: Key,
  desc: string,
  opts?: OptionOptions & { required?: IsRequired }
) => IOptionBuilder<Options & RequiredIf<IsRequired, Record<Key, GetOptionType<OptionOptions>>>>;

type RequiredIf<If, Then> = If extends true ? Then : Partial<Then>;

/** A builder for creating options. */
export const OptionBuilder: Class<IOptionBuilder>;

/** Extract the ApplicationCommandOption[] out of an OptionBuilder */
export function getOptionsFromBuilder(
  builder: IOptionBuilder | undefined
): ApplicationCommandOption[];

/** Extract the Record<string, Autocomplete> out of an OptionBuilder */
export function getAutoCompleteHandlersFromBuilder(
  builder: IOptionBuilder | undefined
): Record<string, Autocomplete>;

export type GetOptionsFromBuilder<T extends IOptionBuilder> = T extends IOptionBuilder<infer U>
  ? U
  : never;
