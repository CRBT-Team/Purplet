export class BitArray extends Array<1 | 0> {
  private position = 0;

  static from(value: ArrayLike<1 | 0>): BitArray {
    const arr = new BitArray(value.length);
    for (let i = 0; i < value.length; i++) {
      arr[i] = value[i] ? 1 : 0;
    }
    arr.position = arr.length;
    return arr;
  }

  static fromUint8Array(arr: Uint8Array): BitArray {
    const result = new BitArray(arr.length * 8 + 1);
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < 8; j++) {
        result[i * 8 + 7 - j] = arr[i] & (1 << j) ? 1 : 0;
      }
    }
    return result;
  }

  seek(position: number): this {
    this.position = position;
    return this;
  }

  read(length: number): number {
    let result = 0;
    for (let i = 0; i < length; i++) {
      result |= this[this.position] << i;
      this.position++;
    }
    return result;
  }

  write(value: number, length: number): this {
    for (let i = 0; i < length; i++) {
      this[this.position] = (value & 1) as 1 | 0;
      value >>= 1;
      this.position++;
    }
    return this;
  }

  writeArray(arr: ArrayLike<1 | 0>): this {
    for (let i = 0; i < arr.length; i++) {
      this[this.position] = arr[i] ? 1 : 0;
      this.position++;
    }
    return this;
  }

  asUint8Array(): Uint8Array {
    const arr = new Uint8Array(this.length / 8 + 1);
    for (let i = 0; i < this.length; i++) {
      arr[Math.floor(i / 8)] |= this[i] << (7 - (i % 8));
    }
    return arr;
  }

  concat(other: BitArray): BitArray {
    const arr = new BitArray(this.length + other.length);
    for (let i = 0; i < this.length; i++) {
      arr[i] = this[i];
    }
    for (let i = 0; i < other.length; i++) {
      arr[i + this.length] = other[i];
    }
    return arr;
  }
}
