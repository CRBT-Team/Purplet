export type Bit = 0 | 1;

export class BitBuffer {
  private array: Uint8Array;
  private byteIndex = 0;
  private bitIndex = 0;

  get index() {
    return this.byteIndex * 8 + this.bitIndex;
  }

  set index(value: number) {
    this.byteIndex = Math.floor(value / 8);
    this.bitIndex = value % 8;
  }

  get buffer() {
    return this.array.buffer;
  }

  set buffer(v: ArrayBufferLike) {
    this.array = new Uint8Array(v);
  }

  constructor(input: Uint8Array | ArrayBufferLike | ArrayLike<number> | number = 256) {
    this.array = new Uint8Array(
      input instanceof Uint8Array ? input.buffer : (input as ArrayBufferLike)
    );
  }

  seek(index: number) {
    this.index = index;
    return this;
  }

  read(length = 1) {
    let result = 0;
    for (let i = 0; i < length; i++) {
      const bit = (this.array[this.byteIndex] >> this.bitIndex) & 1;
      result |= bit << i;
      this.bitIndex++;
      if (this.bitIndex >= 8) {
        this.bitIndex = 0;
        this.byteIndex++;
      }
    }
    return result;
  }

  write(value: number, length = 1) {
    for (let i = 0; i < length; i++) {
      const bit = (value >> i) & 1;
      this.array[this.byteIndex] |= bit << this.bitIndex;
      this.bitIndex++;
      if (this.bitIndex >= 8) {
        this.bitIndex = 0;
        this.byteIndex++;
      }
    }
    return this;
  }
}
