import { addImpl, ISampleA, ISampleB, RawSampleA, RawSampleB } from '../shared';

export class SampleA implements ISampleA {
  constructor(readonly raw: RawSampleA) {}

  get id() {
    return this.raw.id;
  }

  get name() {
    return this.raw.name;
  }

  get camelCase() {
    return this.raw.snake_case;
  }

  get otherNumber() {
    return this.raw.other_number;
  }

  get subObject() {
    return new SampleB(this.raw.sub_object);
  }

  get list() {
    return this.raw.list.map(item => new SampleB(item));
  }

  get flag() {
    return this.raw.flag;
  }

  multiplyNumbers() {
    return this.camelCase * this.otherNumber;
  }

  multiplyCamelWithSubObject() {
    return this.camelCase * this.subObject.value;
  }

  sumOfList() {
    return this.list.reduce((acc, item) => acc + item.value, 0);
  }

  sumOfSquaredList() {
    return this.list.reduce((acc, item) => acc + item.squareSelf(), 0);
  }

  multiplyListBy(n: number) {
    return this.list.map(item => new SampleB({ ...item.raw, value: item.value * n }));
  }
}

export class SampleB implements ISampleB {
  constructor(readonly raw: RawSampleB) {}

  get id() {
    return this.raw.id;
  }

  get value() {
    return this.raw.value;
  }

  squareSelf() {
    return this.value * this.value;
  }
}

addImpl('class with raw param + getters', { SampleA, SampleB });
