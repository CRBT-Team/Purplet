// @ts-nocheck
import { addImpl } from '../shared';

const SampleA_proto = {
  get id() {
    return Object.defineProperty(this, 'id', { value: this.raw.id }).id;
  },
  get name() {
    return Object.defineProperty(this, 'name', { value: this.raw.name }).name;
  },
  get camelCase() {
    return Object.defineProperty(this, 'camelCase', { value: this.raw.snake_case }).camelCase;
  },
  get otherNumber() {
    return Object.defineProperty(this, 'otherNumber', { value: this.raw.other_number }).otherNumber;
  },
  get subObject() {
    return Object.defineProperty(this, 'subObject', { value: new SampleB(this.raw.sub_object) })
      .subObject;
  },
  get list() {
    return Object.defineProperty(this, 'list', {
      value: this.raw.list.map(item => new SampleB(item)),
    }).list;
  },
  get flag() {
    return Object.defineProperty(this, 'flag', { value: this.raw.flag }).flag;
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
  get id() {
    return Object.defineProperty(this, 'id', { value: this.raw.id }).id;
  },
  get value() {
    return Object.defineProperty(this, 'value', { value: this.raw.value }).value;
  },
  squareSelf() {
    return this.value * this.value;
  },
};

export function SampleB(raw) {
  this.raw = raw;
}
SampleB.prototype = SampleB_proto;

export function SampleA(raw) {
  this.raw = raw;
}
SampleA.prototype = SampleA_proto;

addImpl('lazy prototypes', { SampleA: raw => new SampleA(raw), SampleB: raw => new SampleB(raw) });
