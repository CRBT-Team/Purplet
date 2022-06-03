type CopiedArrayProps = 'forEach' | 'map' | 'reduce' | 'reduceRight' | 'filter' | 'some' | 'every';

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
    toArray(): Value[];
    toStringArray(): Extract<keyof Enum, string>[];
    clone(): Bitfield<Value>;
    has(bit: Value): boolean;
    add(bit: Value): this;
    remove(bit: Value): this;
    missing(bit: Value): Bitfield<Value>;
    any(bit: Value): boolean;
    equals(other: Bitfield<Value>): boolean;
  };

export type ReadonlyBitfield<Enum extends BitfieldEnum, Value = Enum[keyof Enum]> = Omit<
  Bitfield<Enum, Value>,
  'add' | 'remove'
>;

type BitfieldClass<BF extends ReadonlyBitfield> = BF extends Bitfield<infer A, infer B>
  ? {
      new (bitfield?: (B extends bigint ? string | bigint : number) | ReadonlyBitfield<A, B>): BF;
    }
  : never;
type ReadonlyBitfieldClass<BF extends ReadonlyBitfield> = BF extends ReadonlyBitfield<
  infer A,
  infer B
>
  ? {
      new (bitfield?: (B extends bigint ? string | bigint : number) | ReadonlyBitfield<A, B>): BF;
    }
  : never;

export function createBitfieldClass<Enum extends BitfieldEnum>(
  name: string,
  data: Enum
): BitfieldClass<Bitfield<Enum>>;
export function createReadonlyBitfield<T extends Bitfield>(
  bitfield: BitfieldClass<T>
): T extends Bitfield<infer A, infer B> ? ReadonlyBitfieldClass<ReadonlyBitfield<A, B>> : never;
