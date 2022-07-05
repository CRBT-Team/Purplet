type CopiedArrayProps = 'forEach' | 'map' | 'reduce' | 'reduceRight' | 'some' | 'every';

type BitfieldEnum = Record<string | number, string | number | bigint>;

export type Bitfield<Enum extends BitfieldEnum, Value = Enum[keyof Enum]> = Pick<
  Array<Value>,
  CopiedArrayProps
> &
  Iterable<Value> & {
    [Key in Extract<keyof Enum, string> as `has${Capitalize<Key>}`]: boolean;
  } & {
    bitfield: Value;
    toJSON(): Value extends bigint ? string : number;
    toString(): string;
    toArray(): Value[];
    toStringArray(): Extract<keyof Enum, string>[];
    clone(): Bitfield<Enum>;
    has(bit: Value): boolean;
    add(bit: Value): this;
    remove(bit: Value): this;
    filter(fn: (bit: Value) => boolean): Bitfield<Enum>;
    missing(bit: Value): Bitfield<Enum>;
    any(bit: Value): boolean;
    equals(other: Bitfield<Enum>): boolean;
    freeze(): ReadonlyBitfield<Enum>;
  };

export type ReadonlyBitfield<Enum extends BitfieldEnum, Value = Enum[keyof Enum]> = Omit<
  Bitfield<Enum, Value>,
  'add' | 'remove' | 'freeze'
> & {
  [Key in Extract<keyof Enum, string> as `has${Capitalize<Key>}`]: boolean;
};

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
      resolve(...data: BitfieldResolvable<Enum, Value>[]): BF;
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
      resolve(...data: BitfieldResolvable<Enum, Value>[]): BF;
    }
  : never;

export function createBitfieldClass<Enum extends BitfieldEnum>(
  name: string,
  data: Enum
): BitfieldClass<Bitfield<Enum>>;
export function createReadonlyBitfield<T extends Bitfield>(
  bitfield: BitfieldClass<T>
): T extends Bitfield<infer A, infer B> ? ReadonlyBitfieldClass<ReadonlyBitfield<A, B>> : never;
