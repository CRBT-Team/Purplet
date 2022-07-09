import { BitBuffer } from './BitBuffer';
import { decodeCustomId, encodeCustomId } from './custom-id';

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
    return new Uint8Array(buffer.buffer.slice(0, Math.ceil(buffer.index / 8)));
  }

  decode(value: Uint8Array): T {
    return this.options.read(new BitBuffer(value));
  }

  encodeCustomId(value: T, bufferLength = 256) {
    return encodeCustomId(this.encode(value, bufferLength));
  }

  decodeCustomId(value: string): T {
    return this.decode(decodeCustomId(value));
  }
}
