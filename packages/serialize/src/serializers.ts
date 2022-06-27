import type { BitBuffer } from './BitBuffer';
import { BitSerializer, BitSerializerOptions } from './types';

/** Booleans are serialized as a single bit, 0 for false and 1 for true. */
export const boolean: BitSerializerOptions<boolean> = new BitSerializer({
  read(buffer: BitBuffer): boolean {
    return buffer.read() === 1;
  },
  write(value: boolean, buffer: BitBuffer): void {
    buffer.write(value ? 1 : 0);
  },
  check(value): value is boolean {
    return typeof value === 'boolean';
  },
});

function unsigned(bits: number): BitSerializerOptions<number> {
  return new BitSerializer({
    read(buffer: BitBuffer): number {
      return buffer.read(bits);
    },
    write(value: number, buffer: BitBuffer): void {
      buffer.write(value, bits);
    },
    check(value): value is number {
      return typeof value === 'number' && Math.floor(value) === value && value >= 0;
    },
  });
}

export const u8 = unsigned(8);
export const u16 = unsigned(16);
export const u32 = unsigned(32);
