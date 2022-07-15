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
  this.raw = raw;
  this.id = raw.id;
  this.value = raw.value;
}
SampleB.prototype = SampleB_proto;

export function SampleA(raw) {
  this.raw = raw;
  this.id = raw.id;
  this.name = raw.name;
  this.camelCase = raw.snake_case;
  this.otherNumber = raw.other_number;
  this.flag = raw.flag;
}
SampleA.prototype = SampleA_proto;

addImpl('lazy prototypes + assign this.', {
  SampleA: raw => new SampleA(raw),
  SampleB: raw => new SampleB(raw),
});
