// @ts-nocheck

function toValue(values) {
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

  missing(...flags) {
    return new Bitfield(this.bitfield).remove(flags);
  }

  any(...flags) {
    return (this.bitfield & toValue(flags)) !== 0;
  }

  equals(other) {
    return this.bitfield === toValue([other]);
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

  toStringArray() {
    return this.map(x => this.constructor.flags[x]);
  }

  clone() {
    return new this.constructor(this.bitfield);
  }

  forEach(callback) {
    this.toArray().forEach(callback);
  }

  map(callback) {
    return this.toArray().map(callback);
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

  toString() {
    return String(this.bitfield);
  }

  freeze() {
    return Object.freeze(this);
  }

  *[Symbol.iterator]() {
    yield* this.toArray();
  }
}

export function createBitfieldClass(name, flagObject) {
  const Class = class Class extends Bitfield {
    static flags = flagObject;
    static resolveValue(...data) {
      return data
        .map(data => {
          if (typeof data === 'string') {
            return Class.flags[data] ?? BigInt(data);
          } else if (Array.isArray(data)) {
            return Class.resolveValue(...data);
          } else {
            return toValue([data]);
          }
        })
        .reduce((a, b) => a | b);
    }
    static resolve(...data) {
      return new Class(Class.resolveValue(...data));
    }
  };
  Object.defineProperty(Class, 'name', { value: name });
  for (const flag in flagObject) {
    if (!flag.match(/^[0-9]/)) {
      Object.defineProperty(Class.prototype, 'has' + flag[0].toUpperCase() + flag.slice(1), {
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
