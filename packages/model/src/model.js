// @ts-nocheck

class Model {
  copyList = [];
  proto = {};
  copy(from, to) {
    this.copyList.push({ from, to: to || from });
    return this;
  }
  get(k, deps, getter) {
    Object.defineProperty(this.proto, k, {
      get() {
        return Object.defineProperty(this, k, { value: getter(this) })[k];
      },
    });
    return this;
  }
  method(k, deps, method) {
    Object.defineProperty(this.proto, k, {
      value(...args) {
        return method(this, ...args);
      },
    });
    return this;
  }
}

export function createModel(fn) {
  const model = new Model();
  fn(model);
  const copyList = model.copyList;
  function Class(raw) {
    this.raw = raw;

    for (const { from, to } of copyList) {
      this[to] = this.raw[from];
    }
  }
  Class.prototype = model.proto;
  Class.pick = Class.omit = () => Class;
  return Class;
}
