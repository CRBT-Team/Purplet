import { ApplicationCommandOptionData, ApplicationCommandOptionType, Channel, Role, User } from 'discord.js';

const OPTIONS = Symbol('OPTIONS');

export interface Choice<Value extends string = string> {
  name: string;
  value: Value;
}

export type ChoiceObject<Enum extends string> = Record<Enum, string>;

/** Underlying interface for the Option Builder */
export interface IOptionBuilder<Options = Record<string, unknown>> {
  [OPTIONS]: ApplicationCommandOptionData[];

  string<Name extends string>(name: Name, description: string, required: true): IOptionBuilder<Options & { [K in Name]: string }>;
  string<Name extends string>(name: Name, description: string, required?: false): IOptionBuilder<Options & { [K in Name]?: string }>;
  integer<Name extends string>(name: Name, description: string, required: true): IOptionBuilder<Options & { [K in Name]: number }>;
  integer<Name extends string>(name: Name, description: string, required?: false): IOptionBuilder<Options & { [K in Name]?: number }>;
  number<Name extends string>(name: Name, description: string, required: true): IOptionBuilder<Options & { [K in Name]: number }>;
  number<Name extends string>(name: Name, description: string, required?: false): IOptionBuilder<Options & { [K in Name]?: number }>;
  boolean<Name extends string>(name: Name, description: string, required: true): IOptionBuilder<Options & { [K in Name]: boolean }>;
  boolean<Name extends string>(name: Name, description: string, required?: false): IOptionBuilder<Options & { [K in Name]?: boolean }>;
  channel<Name extends string>(name: Name, description: string, required: true): IOptionBuilder<Options & { [K in Name]: Channel }>;
  channel<Name extends string>(name: Name, description: string, required?: false): IOptionBuilder<Options & { [K in Name]?: Channel }>;
  user<Name extends string>(name: Name, description: string, required: true): IOptionBuilder<Options & { [K in Name]: User }>;
  user<Name extends string>(name: Name, description: string, required?: false): IOptionBuilder<Options & { [K in Name]?: User }>;
  mentionable<Name extends string>(name: Name, description: string, required: true): IOptionBuilder<Options & { [K in Name]: User | Role }>;
  mentionable<Name extends string>(name: Name, description: string, required?: false): IOptionBuilder<Options & { [K in Name]?: User | Role }>;
  role<Name extends string>(name: Name, description: string, required: true): IOptionBuilder<Options & { [K in Name]: Role }>;
  role<Name extends string>(name: Name, description: string, required?: false): IOptionBuilder<Options & { [K in Name]?: Role }>;
  enum<Name extends string, Enum extends string>(name: Name, description: string, choices: ReadonlyArray<Choice<Enum>>, required: true): IOptionBuilder<Options & { [K in Name]: Enum }>;
  enum<Name extends string, Enum extends string>(name: Name, description: string, choices: ReadonlyArray<Choice<Enum>>, required?: false): IOptionBuilder<Options & { [K in Name]?: Enum }>;
  enum<Name extends string, Enum extends string>(name: Name, description: string, required: true, choices: ReadonlyArray<Choice<Enum>>): IOptionBuilder<Options & { [K in Name]: Enum }>;
  enum<Name extends string, Enum extends string>(name: Name, description: string, required: false, choices: ReadonlyArray<Choice<Enum>>): IOptionBuilder<Options & { [K in Name]?: Enum }>;
  enum<Name extends string, Enum extends string>(name: Name, description: string, choices: ChoiceObject<Enum>, required: true): IOptionBuilder<Options & { [K in Name]: Enum }>;
  enum<Name extends string, Enum extends string>(name: Name, description: string, choices: ChoiceObject<Enum>, required?: false): IOptionBuilder<Options & { [K in Name]?: Enum }>;
  enum<Name extends string, Enum extends string>(name: Name, description: string, required: true, choices: ChoiceObject<Enum>): IOptionBuilder<Options & { [K in Name]: Enum }>;
  enum<Name extends string, Enum extends string>(name: Name, description: string, required: false, choices: ChoiceObject<Enum>): IOptionBuilder<Options & { [K in Name]?: Enum }>;
}

class OptionsBuilderClass {
  [OPTIONS]: ApplicationCommandOptionData[] = [];

  createOption(type: ApplicationCommandOptionType) {
    return (name: string, description: string, required?: boolean) => {
      this[OPTIONS].push({
        type,
        name,
        description,
        required: !!required,
      });
      return this;
    };
  }

  string = this.createOption('STRING');
  integer = this.createOption('INTEGER');
  boolean = this.createOption('BOOLEAN');
  channel = this.createOption('CHANNEL');
  user = this.createOption('USER');
  mentionable = this.createOption('MENTIONABLE');
  role = this.createOption('ROLE');
  number = this.createOption('NUMBER');

  enum(name: string, description: string, choices: Choice[], required?: boolean) {
    this[OPTIONS].push({
      type: 'STRING',
      name,
      description,
      choices,
      required: !!required,
    });
    return this;
  }
}

export function getOptionsFromBuilder(builder: IOptionBuilder | undefined) {
  return builder ? builder[OPTIONS] : [];
}

export const OptionBuilder = OptionsBuilderClass as unknown as { new (): IOptionBuilder };

export type GetOptionsFromBuilder<T extends IOptionBuilder> = T extends IOptionBuilder<infer U> ? U : never;
