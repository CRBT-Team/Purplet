// @ts-nocheck

function toValue(...values) {
  return values.map(x => x?.bitfield ?? x).reduce((a, b) => a | b);
}

class Bitfield {
  constructor(bitfield = 0) {
    this.bitfield =
      typeof bitfield === 'string'
        ? BigInt(bitfield)
        : bitfield instanceof Bitfield
        ? bitfield.bitfield
        : bitfield;
  }

  has(...flag) {
    const resolved = toValue(flag);
    return (this.bitfield & resolved) === resolved;
  }

  add(...flag) {
    this.bitfield |= toValue(flag);
    return this;
  }

  remove(...flag) {
    this.bitfield &= ~toValue(flag);
    return this;
  }

  missing(flags) {
    return toBitField(this.bitfield).remove(flags);
  }

  any(bit) {
    return (this.bitfield & toValue(bit)) !== 0;
  }

  equals(other) {
    return this.bitfield === toValue(other);
  }

  toArray() {
    const array = [];
    const start = typeof this.bitfield === 'bigint' ? 1n : 1;
    const inc = typeof this.bitfield === 'bigint' ? 2n : 2;
    for (let i = start; i < this.bitfield; i *= inc) {
      if (this.has(i)) {
        array.push(i);
      }
    }
    return array;
  }

  forEach(callback) {
    this.toArray().forEach(callback);
  }

  map(callback) {
    return this.toArray().map(callback);
  }

  clone() {
    return new BitField(this.bitfield);
  }

  reduce(callback, initialValue) {
    return this.toArray().reduce(callback, initialValue);
  }

  filter(callback) {
    return this.toArray().filter(callback);
  }

  some(callback) {
    return this.toArray().some(callback);
  }

  every(callback) {
    return this.toArray().every(callback);
  }

  toJSON() {
    return typeof this.bitfield === 'bigint' ? String(this.bitfield) : this.bitfield;
  }

  *[Symbol.iterator]() {
    yield* this.toArray();
  }
}

export function createBitfieldClass(name, flagObject) {
  const Class = class extends Bitfield {};
  Object.defineProperty(Class, 'name', { value: name });
  for (const flag in flagObject) {
    if (!flag.match(/^[0-9]/)) {
      Object.defineProperty(Class, 'has' + flag[0].toUpperCase() + flag.slice(1), {
        get() {
          return this.has(flagObject[flag]);
        },
      });
    }
  }
  return Class;
}

export function createReadonlyBitfield(cls) {
  return cls;
}
