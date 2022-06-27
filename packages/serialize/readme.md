# @purplet/serialize

> Formerly named `@davecode/serialize`

Utilities for binary serialization, used by Purplet, with the goal to cram as much data into Discord's `custom_id` as possible. This is done by using Base1114111 (a 2.5byte/char encoding), then a custom set of serializations that work on the bit-level instead of the byte-level, meaning two `booleans` will occupy not take two separate bytes, and other data that is typically one byte may be spread across multiple.

This package provides functions to use Base1114111 to encode custom ids from `Uint8Array`s and a handful of serializers for compressing JSON-like data into those `Uint8Array`s. You can either build specialized serializers to go off the shape of your data, or use the `generic` serializer as a drop-in replacement for `JSON.stringify`.

The naming of this package is due to it originally being a standalone project, but I believe the source code belongs within the Purplet monorepo, so we can maintain it with its primary use case.

## Encoding and Decoding `custom_id`s

```ts
import { encodeCustomId, decodeCustomId } from '@purplet/serialize';

const id = encodeCustomId(new Uint8Array([1, 2, 3, 4, 5]));
const decoded = decodeCustomId(id);
```

## Alternate to `JSON.stringify` via the generic serializer

```ts
import { serializers as S } from '@purplet/serialize';

const encoded = S.generic.encodeCustomId({ foo: 'bar', number: 32n }); // works with Dates, BigInts, and other types
const decoded = S.generic.decodeCustomId(encoded);
```

## List of serializers built-in to the library

- **`u8`**: unsigned 8-bit integer
- **`u16`**: unsigned 16-bit integer
- **`u32`**: unsigned 32-bit integer
- **`u8bi`**: unsigned 8-bit integer as a `bigint`
- **`u16bi`**: unsigned 16-bit integer as a `bigint`
- **`u32bi`**: unsigned 32-bit integer as a `bigint`
- **`u64bi`**: unsigned 64-bit integer as a `bigint`
- **`u128bi`**: unsigned 128-bit integer as a `bigint`
- **`s8`**: signed 8-bit integer
- **`s16`**: signed 16-bit integer
- **`s32`**: signed 32-bit integer
- **`s8bi`**: signed 8-bit integer as a `bigint`
- **`s16bi`**: signed 16-bit integer as a `bigint`
- **`s32bi`**: signed 32-bit integer as a `bigint`
- **`s64bi`**: signed 64-bit integer as a `bigint`
- **`s128bi`**: signed 128-bit integer as a `bigint`
- **`boolean`**: `true` or `false`
- **`date`**: a `Date` object
- **`float`**: a `number` stored in IEEE 754 format
- **`generic`**: any json serializable type + ` Date``BigInt `
- **`genericArray`**: array of `Generic`
- **`genericObject`**: object with `Generic` values
- **`number`**: any valid javascript `number`
- **`snowflake`**: a discord snowflake id as a string
- **`string`**: a string (must be 255 bytes or less)

Functions that return serializers

- **`or(A, B)`**: `A | B`, uses a prefix bit to indicate which serializer to use.
- **`arrayOf(T)`**: array of `T`
- **`nullable(T)`**: `T | null`
- **`constant(value)`**: does not emit or read anything, just returns value. useful with `or`
- **`unsignedInt(bytes)`**: unsigned int of `bytes` length. due to js limits, bytes must be <31.
- **`signedInt(bytes)`**: signed int of `bytes` length. due to js limits, bytes must be <31.
- **`unsignedBigInt(bytes)`**: unsigned bigint of `bytes` length
- **`signedBigInt(bytes)`**: signed bigint of `bytes` length

## Custom serializers

The `read` and `write` functions passed to `BitSerializer`s operate on `BitBuffer`s, which keep track of where they are. Reading or writing advances the buffer's position. By default, 256 bytes are allocated, but the caller can increase or decrease it.

```ts
export const boolean = new BitSerializer({
  // Given a buffer, read from it and return a parsed value.
  read(buffer) {
    return buffer.read() === 1;
  },
  // Given a value and a buffer, write the serialized value.
  write(value, buffer) {
    buffer.write(value ? 1 : 0);
  },
  // Used by `or` and potentially other serializers to determine if the data matches this.
  // If ommitted, will ALWAYS return true
  check(value): value is boolean {
    return typeof value === 'boolean';
  },
});
```

## `BitBuffer` API

Constructors:

- `new(bytes: number)`: creates a new buffer with `bytes` allocated.
- `new(buf: Uint8Array | ArrayBufferLike | ArrayLike<number>)`: creates a new buffer with the contents of `buf`.

Properties

- `buffer: ArrayBuffer` (read/write): the underlying buffer.
- `index: number` (read/write): the current index in the buffer (bits).

Methods

- `seek(index: number)`: sets the buffer's index to `index` (bits)
- `read(length: number)`: reads `length` bits from the buffer as a signed value.
- `write(value: number, length: number)`: writes `value` as `length` bits to the buffer.
- `readBI(length: number)`: reads `length` bits from the buffer as a `bigint`.
- `writeBI(value: bigint, length: number)`: writes `value` as `length` bits to the buffer.

## `BitSerializer<T>` API

Constructors:

- `new(options: BitSerializerOptions)`: creates a new serializer with the given options. see above.

Methods:

- `read(buffer: BitBuffer)`: reads from the buffer and returns the parsed value.
- `write(value: T, buffer: BitBuffer)`: writes the serialized value to the buffer.
- `check(value: T)`: returns `true` if the value can be serialized by this serializer.
- `encode(value: T)`: encodes the value into a `Uint8Array` without needing to use `BitBuffer`.
- `decode(buf: Uint8Array)`: decodes the value from a `Uint8Array` without needing to use `BitBuffer`.
- `encodeCustomId(value: T)`: encodes the value into a `string` that can be used as a custom id. Shorthand for `encodeCustomId(serializer.encode(...))`
- `decodeCustomId(id: string)`: decodes the value from a `string` that was created with `encodeCustomId`. Shorthand for `decodeCustomId(serializer.decode(...))`
