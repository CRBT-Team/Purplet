import { BitArray } from './BitArray';
import { Serializer } from './types';

export type GenericValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | { [key: string]: GenericValue }
  | Array<GenericValue>;

export const BooleanSerializer: Serializer<boolean> = {
  serialize(value: boolean): BitArray {
    return BitArray.from([value ? 1 : 0]);
  },
  deserialize(value: BitArray): boolean {
    return value.read(1) === 1;
  },
  check(v: unknown): v is boolean {
    return typeof v === 'boolean';
  },
};

export const IntegerSerializer: Serializer<number> = {
  serialize(value: number): BitArray {
    const b = new BitArray();
    if (value === 0) {
      b.write(0, 1);
      return b;
    }
    b.write(1, 1);
    b.write(value < 0 ? 0 : 1, 1);
    if (value < -65536 || value > 65535) {
      b.write(1, 1);
      b.write(Math.abs(value), 32);
    } else {
      b.write(0, 1);
      b.write(Math.abs(value), 16);
    }
    return b;
  },
  deserialize(value: BitArray): number {
    if (value.read(1) === 0) {
      return 0;
    }
    const sign = value.read(1) === 0 ? -1 : 1;
    if (value.read(1) === 1) {
      return value.read(32) * sign;
    }
    return value.read(16) * sign;
  },
  check(v: unknown): v is number {
    return typeof v === 'number' && Math.floor(v) === v && v >= -2147483648 && v <= 2147483647;
  },
};

export const StringSerializer: Serializer<string> = {
  serialize(value: string): BitArray {
    if (value.length > 255) {
      throw new Error('Unsupported');
    }
    const b = new BitArray();
    b.write(value.length, 8);
    for (let i = 0; i < value.length; i++) {
      b.write(value.charCodeAt(i), 8);
    }
    return b;
  },
  deserialize(value: BitArray): string {
    const length = value.read(8);
    const chars = new Array(length);
    for (let i = 0; i < length; i++) {
      chars[i] = String.fromCharCode(value.read(8));
    }
    return chars.join('');
  },
  check(v: unknown): v is string {
    return typeof v === 'string';
  },
};

export const FloatSerializer: Serializer<number> = {
  serialize(value: number): BitArray {
    const f64 = new Float64Array(1);
    f64[0] = value;
    const uint = new Uint8Array(f64.buffer);

    const b = new BitArray();
    for (let i = 0; i < uint.length; i++) {
      b.write(uint[i], 8);
    }

    return b;
  },
  deserialize(value: BitArray): number {
    const f64 = new Float64Array(1);
    const uint = new Uint8Array(f64.buffer);

    for (let i = 0; i < uint.length; i++) {
      uint[i] = value.read(8);
    }

    return f64[0];
  },
  check(v: unknown): v is number {
    return typeof v === 'number';
  },
};

export const DateSerializer: Serializer<Date> = {
  serialize(value: Date): BitArray {
    return NumberSerializer.serialize(value.getTime());
  },
  deserialize(value: BitArray): Date {
    return new Date(NumberSerializer.deserialize(value));
  },
  check(v: unknown): v is Date {
    return v instanceof Date;
  },
};

export class MultiSerializer<A, B> implements Serializer<A | B> {
  constructor(private readonly a: Serializer<A>, private readonly b: Serializer<B>) {}

  serialize(value: A | B): BitArray {
    const isA = this.a.check(value);

    const bits = new BitArray();
    bits.write(isA ? 1 : 0, 1);
    bits.writeArray(isA ? this.a.serialize(value as A) : this.b.serialize(value as B));

    return bits;
  }
  deserialize(value: BitArray): A | B {
    if (value.read(1) === 1) {
      return this.a.deserialize(value);
    }
    return this.b.deserialize(value);
  }
  check(value: unknown): value is A | B {
    return this.a.check(value) || this.b.check(value);
  }
}

export class ArraySerializer<A> implements Serializer<A[]> {
  constructor(private readonly a: Serializer<A>) {}

  serialize(value: A[]): BitArray {
    const bits = new BitArray();
    bits.writeArray(IntegerSerializer.serialize(value.length));
    for (let i = 0; i < value.length; i++) {
      bits.writeArray(this.a.serialize(value[i]));
    }
    return bits;
  }

  deserialize(value: BitArray): A[] {
    const length = IntegerSerializer.deserialize(value);
    const array = new Array<A>(length);
    for (let i = 0; i < length; i++) {
      array[i] = this.a.deserialize(value);
    }
    return array;
  }

  check(value: unknown): value is A[] {
    return Array.isArray(value) && value.every((x) => this.a.check(x));
  }
}

export const NumberSerializer = new MultiSerializer(IntegerSerializer, FloatSerializer);

export const GenericSerializer: Serializer<GenericValue> = {
  serialize(value: GenericValue): BitArray {
    if (value === null) return BitArray.from([1, 0, 0]);
    if (value === undefined) return BitArray.from([1, 0, 1]);
    if (typeof value === 'boolean') {
      return BitArray.from([0, 1, 0]).writeArray(BooleanSerializer.serialize(value));
    }
    if (typeof value === 'number') {
      return BitArray.from([0, 0]).writeArray(NumberSerializer.serialize(value));
    }
    if (typeof value === 'string') {
      return BitArray.from([1, 1]).writeArray(StringSerializer.serialize(value));
    }
    if (Array.isArray(value)) {
      return BitArray.from([0, 1, 1, 0, 1]).writeArray(GenericArraySerializer.serialize(value));
    }
    if (value instanceof Date) {
      return BitArray.from([0, 1, 1, 1, 0, 0]).writeArray(DateSerializer.serialize(value));
    }
    return BitArray.from([0, 1, 1, 0, 0]).writeArray(GenericObjectSerializer.serialize(value));
  },
  deserialize(value: BitArray): GenericValue {
    const bit1 = value.read(1);
    const bit2 = value.read(1);
    if (bit1 === 1 && bit2 === 0) {
      return value.read(1) ? undefined : null;
    }
    if (bit1 === 0 && bit2 === 0) {
      return NumberSerializer.deserialize(value);
    }
    if (bit1 === 1 && bit2 === 1) {
      return StringSerializer.deserialize(value);
    }
    const bit3 = value.read(1);
    if (bit3 === 0) {
      return BooleanSerializer.deserialize(value);
    }
    const bit4 = value.read(1);
    const bit5 = value.read(1);
    if (bit4 === 0) {
      if (bit5 === 1) {
        return GenericArraySerializer.deserialize(value);
      } else {
        return GenericObjectSerializer.deserialize(value);
      }
    }

    const bit6 = value.read(1);

    if (bit5 === 0 && bit6 === 0) {
      return DateSerializer.deserialize(value);
    }
  },
  check(value: unknown): value is GenericValue {
    if (typeof value === 'function') return false;
    if (value !== null && typeof value === 'object' && value.constructor !== Object) return false;
    return true;
  },
};

export const GenericArraySerializer = new ArraySerializer(GenericSerializer);

export const GenericObjectSerializer: Serializer<Record<string, GenericValue>> = {
  serialize(value: Record<string, GenericValue>): BitArray {
    const bits = new BitArray();
    bits.writeArray(IntegerSerializer.serialize(Object.keys(value).length));
    for (let key in value) {
      bits.writeArray(StringSerializer.serialize(key));
      bits.writeArray(GenericSerializer.serialize(value[key]));
    }
    return bits;
  },
  deserialize(value: BitArray): Record<string, GenericValue> {
    const length = IntegerSerializer.deserialize(value);
    const result = {};
    for (let i = 0; i < length; i++) {
      const key = StringSerializer.deserialize(value);
      result[key] = GenericSerializer.deserialize(value);
    }
    return result;
  },
  check(value: unknown): value is Record<string, GenericValue> {
    return value !== null && typeof value === 'object' && value.constructor === Object;
  },
};
