import type { Dict } from '@paperdave/utils';
import type { BitBuffer } from './BitBuffer';
import { BitSerializer } from './BitSerializer';
import type { Generic } from './utils';
import { fillArray } from './utils';

/** Creates a serializer that does not read/write any data, but instead return a predefined constant. */
export function constant<T>(input: T): BitSerializer<T> {
  return new BitSerializer({
    read: () => input,
    write: () => {},
    check(value): value is T {
      return value === input;
    },
  });
}

const nullSerializer = constant(null);

/** Serializer for a boolean value. */
export const boolean = new BitSerializer({
  read(buffer) {
    return buffer.read() === 1;
  },
  write(value, buffer) {
    buffer.write(value ? 1 : 0);
  },
  check(value): value is boolean {
    return typeof value === 'boolean';
  },
});

/** Creates a serializer for unsigned integers, at the given precision. */
function unsignedInt(bits: number) {
  return new BitSerializer({
    read(buffer) {
      return buffer.read(bits);
    },
    write(value, buffer) {
      buffer.write(value, bits);
    },
    check(value): value is number {
      return (
        typeof value === 'number' && Math.floor(value) === value && value >= 0 && value < 1 << bits
      );
    },
  });
}

/** Creates a serializer for signed integers, at the given precision. */
function signedInt(bits: number) {
  const signBit = -1 << (bits - 1);
  return new BitSerializer({
    read(buffer) {
      const value = buffer.read(bits);
      const sign = buffer.read();
      return value + (sign ? signBit : 0);
    },
    write(value, buffer) {
      const sign = value < 0;
      if (sign) {
        value += signBit;
      }
      buffer.write(value, bits);
      buffer.write(sign ? 1 : 0);
    },
    check(value): value is number {
      return (
        typeof value === 'number' &&
        Math.floor(value) === value &&
        value >= -(1 << (bits - 1)) &&
        value < 1 << (bits - 1)
      );
    },
  });
}

/** Creates a serializer for unsigned BigInts, at the given precision. */
function unsignedBigInt(bits: number) {
  return new BitSerializer({
    read(buffer) {
      return buffer.readBI(bits);
    },
    write(value, buffer) {
      buffer.writeBI(value, bits);
    },
    check(value): value is bigint {
      return typeof value === 'bigint' && value >= 0;
    },
  });
}

/** Creates a serializer for unsigned floats, at the given precision. */
function signedBigInt(bits: number) {
  const signBit = -1n << (BigInt(bits) - 1n);
  return new BitSerializer({
    read(buffer: BitBuffer) {
      const value = buffer.readBI(bits);
      const sign = buffer.readBI();
      return value + (sign ? signBit : 0n);
    },
    write(value, buffer) {
      const sign = value < 0;
      if (sign) {
        value += signBit;
      }
      buffer.writeBI(value, bits);
      buffer.write(sign ? 1 : 0);
    },
    check(value): value is bigint {
      return typeof value === 'bigint';
    },
  });
}

/* Serializer for 8-bit unsigned integers. 0 <= n <= 255. */
export const u8 = unsignedInt(8);
/* Serializer for 16-bit unsigned integers. 0 <= n <= 65535. */
export const u16 = unsignedInt(16);
/* Serializer for 32-bit unsigned integers. 0 <= n <= 4294967295. */
export const u32 = unsignedInt(32);
/* Serializer for 8-bit signed integers. -128 <= n <= 127. */
export const s8 = signedInt(8);
/* Serializer for 16-bit signed integers. -32768 <= n <= 32767. */
export const s16 = signedInt(16);
/* Serializer for 32-bit signed integers. -2147483648 <= n <= 2147483647. */
export const s32 = signedInt(32);

/* Serializer for 8-bit unsigned BigInts. 0n <= n <= 255n. */
export const u8bi = unsignedBigInt(8);
/* Serializer for 16-bit unsigned BigInts. 0n <= n <= 65535n. */
export const u16bi = unsignedBigInt(16);
/* Serializer for 32-bit unsigned BigInts. 0n <= n <= 4294967295n. */
export const u32bi = unsignedBigInt(32);
/* Serializer for 64-bit unsigned BigInts. 0n <= n <= 18446744073709551615n. */
export const u64bi = unsignedBigInt(64);
/* Serializer for 128-bit unsigned BigInts. 0n <= n <= (39 digits). */
export const u128bi = unsignedBigInt(128);
/* Serializer for 8-bit signed BigInts. -128n <= n <= 127n. */
export const s8bi = signedBigInt(8);
/* Serializer for 16-bit signed BigInts. -32768n <= n <= 32767n. */
export const s16bi = signedBigInt(16);
/* Serializer for 32-bit signed BigInts. -2147483648n <= n <= 2147483647n. */
export const s32bi = signedBigInt(32);
/* Serializer for 64-bit signed BigInts. -9223372036854775808n <= n <= 9223372036854775807n. */
export const s64bi = signedBigInt(64);
/* Serializer for 128-bit signed BigInts. -170141183460469231731687303715884105728n <= n <= 170141183460469231731687303715884105727n. */
export const s128bi = signedBigInt(128);

/* Serializer for Discord snowflakes, which are u64bi strings. If you have a bigint value, use the `u64bi` serializer instead. */
export const snowflake = new BitSerializer({
  read(buffer) {
    return buffer.readBI(64).toString();
  },
  write(value, buffer) {
    buffer.writeBI(BigInt(value), 64);
  },
  check(value): value is string {
    return typeof value === 'string' && /^[0-9]{18,20}$/.test(value);
  },
});

/** Serializer for a JavaScript number (IEEE-754/float64) value. */
export const float = new BitSerializer({
  read(buffer) {
    return new Float64Array(new Uint8Array(fillArray(8, () => buffer.read(8))).buffer)[0];
  },
  write(value, buffer) {
    const view = new Uint8Array(new Float64Array([value]).buffer);
    for (let i = 0; i < 8; i++) {
      buffer.write(view[i], 8);
    }
  },
  check(value): value is number {
    return typeof value === 'number';
  },
});

/** Serializer for a `Date` value. */
export const date = new BitSerializer({
  read(buffer) {
    return new Date(Number(buffer.readBI(52)));
  },
  write(value, buffer) {
    buffer.writeBI(BigInt(value.getTime()), 52);
  },
  check(value): value is Date {
    return value instanceof Date;
  },
});

/** Serializer for a string value. Uses a length + content approach, so it does not support lengths above 255. */
export const string = new BitSerializer({
  read(buffer) {
    const length = buffer.read(8);
    const bytes = fillArray(length, () => buffer.read(8));
    return new TextDecoder().decode(new Uint8Array(bytes));
  },
  write(value, buffer) {
    const bytes = new TextEncoder().encode(value);
    if (bytes.length > 255) {
      throw new Error('String serializer does not support strings over 255 bytes.');
    }
    buffer.write(bytes.length, 8);
    bytes.forEach(byte => buffer.write(byte, 8));
  },
  check(value): value is string {
    return typeof value === 'string';
  },
});

/**
 * Creates a serializer for an array of values. Uses a length + content approach, so it does not
 * support lengths above 255.
 */
export function arrayOf<T>(serializer: BitSerializer<T>) {
  return new BitSerializer({
    read(buffer) {
      const length = buffer.read(8);
      const array = [];
      for (let i = 0; i < length; i++) {
        array.push(serializer.read(buffer));
      }
      return array;
    },
    write(value, buffer) {
      buffer.write(value.length, 8);
      value.forEach(item => serializer.write(item, buffer));
    },
    check(value): value is any[] {
      return Array.isArray(value) && value.every(item => serializer.check(item));
    },
  });
}

/** Creates a serializer out of two other serializers. Uses one bit to tell them apart. */
export function or<A, B>(a: BitSerializer<A>, b: BitSerializer<B>) {
  return new BitSerializer({
    read(buffer) {
      return buffer.read() ? a.read(buffer) : b.read(buffer);
    },
    write(value, buffer) {
      const isA = a.check(value);
      buffer.write(isA ? 1 : 0, 1);
      if (isA) {
        a.write(value, buffer);
      } else {
        b.write(value, buffer);
      }
    },
    check(value): value is A | B {
      return a.check(value) || b.check(value);
    },
  });
}

/** Serializer for numbers, using an extra bit to allow a short s16 when possible, otherwise float64. */
export const number = or(s16, float);

export function nullable<T>(serializer: BitSerializer<T>) {
  return or(serializer, nullSerializer);
}

export function object<T extends Record<string, unknown>>(definition: {
  [K in keyof T]: BitSerializer<T[K]>;
}): BitSerializer<T> {
  const keys = Object.keys(definition).sort();
  return new BitSerializer({
    read(buffer) {
      const obj = {} as T;
      keys.forEach(key => {
        (obj as any)[key] = definition[key].read(buffer) as any;
      });
      return obj;
    },
    write(value, buffer) {
      keys.forEach(key => {
        definition[key].write(value[key] as any, buffer);
      });
    },
    check(value): value is T {
      return (
        typeof value === 'object' && keys.every(key => definition[key].check((value as any)[key]))
      );
    },
  });
}

/** Serializer for an object of `generic` values. */
export const genericObject = new BitSerializer<Record<string, Generic>>({
  read(buffer) {
    const obj: Dict<Generic> = {};
    let key: string;
    do {
      key = string.read(buffer);
      obj[key] = generic.read(buffer);
    } while (key !== '');
    return obj;
  },
  write(value, buffer) {
    Object.keys(value).forEach(key => {
      string.write(key, buffer);
      generic.write(value[key], buffer);
    });
    string.write('', buffer);
  },
  check(value): value is Record<string, Generic> {
    return (
      value != null &&
      typeof value === 'object' &&
      Object.keys(value).every(key => string.check(key) && generic.check((value as any)[key]))
    );
  },
});

export const genericArray = {
  __proto__: BitSerializer.prototype,
} as unknown as BitSerializer<Generic[]>;

/**
 * Serializer for the `generic` type, which is all JSON-compatible types, but also including Dates,
 * undefined, and bigints up to 128 bits. Discord snowflakes have special treatment here as well, to
 * reduce the number of serialized bytes from ~19 to 4 per snowflake.
 */
export const generic: BitSerializer<Generic> = or(
  or(or(snowflake, string), or(constant(null), constant(undefined))),
  or(or(or(or(date, s128bi), boolean), or(genericArray, genericObject)), number)
);

Object.assign(genericArray, arrayOf(generic));
