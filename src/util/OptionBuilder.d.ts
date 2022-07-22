import { LocalizationMap } from 'discord-api-types/payloads/common';
import {
  AutocompleteInteraction,
  Channel,
  ChannelTypes,
  MessageAttachment,
  Role,
  User,
} from 'discord.js';
import { Class, MaybePromise } from './types';

/** Maps `type` to the option data object you pass in. */
export interface OptionTypes<ThisKey = string, ExistingOptions = null> {
  string: EnumOption<ThisKey, ExistingOptions>;
  integer: NumericOption<ThisKey, ExistingOptions>;
  boolean: BaseOption;
  channel: ChannelOption;
  user: BaseOption;
  mentionable: BaseOption;
  role: BaseOption;
  number: NumericOption<ThisKey, ExistingOptions>;
  attachment: BaseOption;
}

/** Maps `type` to the resolved option */
export interface OptionTypeValues {
  string: string;
  integer: number;
  boolean: boolean;
  channel: Channel;
  user: User;
  mentionable: User | Role;
  role: Role;
  number: number;
  attachment: MessageAttachment;
}

interface BaseOption {
  nameLocalizations?: LocalizationMap;
  descriptionLocalizations?: LocalizationMap;
}

interface AutocompleteOption<ThisKey, ExistingOptions> extends BaseOption {
  autocomplete?: Autocomplete<Partial<ExistingOptions> & Record<ThisKey, T>, T>;
}

type EnumOption<ThisKey, ExistingOptions> =
  | AutocompleteOption<ThisKey, ExistingOptions>
  | (BaseOption & {
      minLength?: number;
      maxLength?: number;
      choices?: Record<T, string>;
      choiceLocalizations?: Record<T, Record<string, string>>;
    });

interface NumericOption<ThisKey, ExistingOptions>
  extends AutocompleteOption<ThisKey, ExistingOptions, number> {
  minValue?: number;
  maxValue?: number;
}

interface ChannelOption extends BaseOption {
  channelTypes?: ChannelTypes[];
}

export interface Choice<T> {
  name: string;
  nameLocalizations?: LocalizationMap;
  value: T;
}

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
  IsRequired extends boolean = boolean
>(
  key: Key,
  desc: string,
  opts?: OptionOptions & { required?: IsRequired }
) => IOptionBuilder<Options & RequiredIf<IsRequired, Record<Key, OptionTypeValues[Type]>>>;

type RequiredIf<If, Then> = If extends false ? Then : Partial<Then>;

/** A builder for creating options. */
export const OptionBuilder: Class<IOptionBuilder>;

/** Extract the ApplicationCommandOption[] out of an OptionBuilder */
export function getOptionsFromBuilder(
  builder: IOptionBuilder | undefined
): ApplicationCommandOptionData[];

/** Extract the Record<string, Autocomplete> out of an OptionBuilder */
export function getAutoCompleteHandlersFromBuilder(
  builder: IOptionBuilder | undefined
): Record<string, Autocomplete>;

export type GetOptionsFromBuilder<T extends IOptionBuilder> = T extends IOptionBuilder<infer U>
  ? U
  : never;
