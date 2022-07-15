// @ts-nocheck
import { addImpl } from '../shared';

const SampleA_proto = {
  get subObject() {
    return Object.defineProperty(this, 'subObject', { value: new SampleB(this.raw.sub_object) })
      .subObject;
  },
  get list() {
    return Object.defineProperty(this, 'list', {
      value: this.raw.list.map(item => new SampleB(item)),
    }).list;
  },
  multiplyNumbers() {
    return this.camelCase * this.otherNumber;
  },
  multiplyCamelWithSubObject() {
    return this.camelCase * this.subObject.value;
  },
  sumOfList() {
    return this.list.reduce((acc, item) => acc + item.value, 0);
  },
  sumOfSquaredList() {
    return this.list.reduce((acc, item) => acc + item.squareSelf(), 0);
  },
  multiplyListBy(n: number) {
    return this.list.map(item => new SampleB({ ...item.raw, value: item.value * n }));
  },
};

const SampleB_proto = {
  squareSelf() {
    return this.value * this.value;
  },
};

export function SampleB(raw) {
  return {
    __proto__: SampleB_proto,
    raw: raw,
    id: raw.id,
    value: raw.value,
  };
}

export function SampleA(raw) {
  return {
    __proto__: SampleA_proto,
    raw: raw,
    id: raw.id,
    name: raw.name,
    camelCase: raw.snake_case,
    otherNumber: raw.other_number,
    flag: raw.flag,
  };
}

addImpl('func + lazy prototypes', {
  SampleA: raw => SampleA(raw),
  SampleB: raw => SampleB(raw),
});
