import { BitArray } from './BitArray';

export interface Encoder {
  encode(value: Uint8Array): string;
  decode(value: string): Uint8Array;
}

export interface Serializer<T = unknown> {
  serialize(value: T): BitArray;
  deserialize(value: BitArray): T;
  check(value: unknown): value is T;
}
