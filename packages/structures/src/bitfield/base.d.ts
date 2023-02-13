type CopiedArrayProps = 'forEach' | 'map' | 'reduce' | 'reduceRight' | 'some' | 'every';
type BitfieldEnum = Record<string | number, string | number | bigint>;

/**
 * A bitfield is a class representing a number, where each bit of that number is a boolean flag.
 * Pass a `typeof EnumName` as the first generic to get a fully typed Bitfield to that enum (see
 * `createBitfieldClass`). Bigint Bitfields are serialized as strings.
 *
 * Bitfields have a `.bitfield` property with the underlying value, but also implement an array-like
 * interface that is iterable and has common array methods like `filter` and `map`. It also has
 * properties for each bit in the form of `.hasFlagName`.
 */
export type Bitfield<Enum extends BitfieldEnum, Value = Enum[keyof Enum]> = Pick<
  Value[],
  CopiedArrayProps
> &
  Iterable<Value> & {
    [Key in Extract<keyof Enum, string> as `has${Capitalize<Key>}`]: boolean;
  } & {
    bitfield: Value;
    toJSON(): Value extends bigint ? string : number;
    toString(): string;
    toArray(): Value[];
    toStringArray(): Array<Extract<keyof Enum, string>>;
    clone(): Bitfield<Enum>;
    has(bit: Value): boolean;
    add(bit: Value): this;
    delete(bit: Value): this;
    filter(fn: (bit: Value) => boolean): Bitfield<Enum>;
    missing(bit: Value): Bitfield<Enum>;
    any(bit: Value): boolean;
    equals(other: Bitfield<Enum>): boolean;
    freeze(): ReadonlyBitfield<Enum>;
  };

/**
 * A readonly bitfield is a bitfield that cannot be modified. To get a mutable Bitfield, you can use
 * `.clone()`
 */
export type ReadonlyBitfield<Enum extends BitfieldEnum, Value = Enum[keyof Enum]> = Omit<
  Bitfield<Enum, Value>,
  'add' | 'delete' | 'freeze'
> & {
  [Key in Extract<keyof Enum, string> as `has${Capitalize<Key>}`]: boolean;
};

/**
 * The following values are resolvable as a Bitfield.
 *
 * - An instance of `Bitfield` or `ReadonlyBitfield`
 * - The underlying bitfield value (if bigint, you may pass a literal bigint or a string)
 * - Strings matching the Enum's keys.
 * - An Array of any of the above.
 */
export type BitfieldResolvable<Enum extends BitfieldEnum, Value = Enum[keyof Enum]> =
  | ReadonlyBitfield<Enum, Value>
  | Bitfield<Enum, Value>
  | (Value extends bigint ? `${bigint}` | bigint : number)
  | Extract<keyof Enum, string>
  | Array<BitfieldResolvable<Enum, Value>>;

type BitfieldClass<BF extends ReadonlyBitfield> = BF extends Bitfield<infer Enum, infer Value>
  ? {
      new (
        bitfield?: (Value extends bigint ? string | bigint : number) | ReadonlyBitfield<Enum, Value>
      ): BF;
      /** Resolves a bitfield-resolvable value into an actual bitfield. */
      resolve(...data: Array<BitfieldResolvable<Enum, Value>>): BF;
    }
  : never;

type ReadonlyBitfieldClass<BF extends ReadonlyBitfield> = BF extends ReadonlyBitfield<
  infer Enum,
  infer Value
>
  ? {
      new (
        bitfield?: (Value extends bigint ? string | bigint : number) | ReadonlyBitfield<Enum, Value>
      ): BF;
      /** Resolves a bitfield-resolvable value into an actual bitfield. */
      resolve(...data: Array<BitfieldResolvable<Enum, Value>>): BF;
    }
  : never;

/**
 * Creates a Bitfield class out of an Enum. See the example below for setting up proper TypeScript Types.
 *
 * Below is an example of how to use this function:
 *
 * ```ts
 * export const MyBitfield = createBitfieldClass<typeof MyEnum>('MyBitfield', MyEnum);
 * export const ReadonlyMyBitfield = createReadonlyBitfield(MyBitfield);
 * export type MyBitfield = InstanceType<typeof MyBitfield>;
 * export type ReadonlyMyBitfield = InstanceType<typeof ReadonlyMyBitfield>;
 * ```
 */
export function createBitfieldClass<Enum extends BitfieldEnum>(
  name: string,
  data: Enum
): BitfieldClass<Bitfield<Enum>>;

/** Helper function, see `createBitfieldClass`'s documentation for usage. */
export function createReadonlyBitfield<T extends Bitfield>(
  bitfield: BitfieldClass<T>
): T extends Bitfield<infer A, infer B> ? ReadonlyBitfieldClass<ReadonlyBitfield<A, B>> : never;

export const Bitfield: BitfieldClass<Bitfield<any>>;
