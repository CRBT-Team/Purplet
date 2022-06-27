import { decodeBase1114111, encodeBase1114111 } from './base1114111';
import { BitBuffer } from './BitBuffer';

export interface BitSerializerOptions<T> {
  write(value: T, buffer: BitBuffer): void;
  read(buffer: BitBuffer): T;
  check?(value: unknown): value is T;
}

export class BitSerializer<T> {
  constructor(private options: BitSerializerOptions<T>) {}

  write(value: T, buffer: BitBuffer): void {
    this.options.write(value, buffer);
  }

  read(buffer: BitBuffer): T {
    return this.options.read(buffer);
  }

  check(value: unknown): value is T {
    return this.options.check?.(value) ?? true;
  }

  encode(value: T, bufferLength = 256) {
    const buffer = new BitBuffer(bufferLength);
    this.options.write(value, buffer);
    return encodeBase1114111(new Uint8Array(buffer.buffer));
  }

  decode(value: string): T {
    const buffer = decodeBase1114111(value);
    return this.options.read(new BitBuffer(buffer));
  }
}
