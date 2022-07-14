import { addImpl, ISampleA, ISampleB, RawSampleA, RawSampleB } from '../shared';

export class SampleA implements ISampleA {
  id: string;
  name: string;
  camelCase: number;
  otherNumber: number;
  subObject: SampleB;
  list: SampleB[];
  flag: boolean;

  constructor(readonly raw: RawSampleA) {
    this.id = raw.id;
    this.name = raw.name;
    this.camelCase = raw.snake_case;
    this.otherNumber = raw.other_number;
    this.subObject = new SampleB(raw.sub_object);
    this.list = raw.list.map(item => new SampleB(item));
    this.flag = raw.flag;
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
  id: string;
  value: number;

  constructor(readonly raw: RawSampleB) {
    this.id = raw.id;
    this.value = raw.value;
  }

  squareSelf() {
    return this.value * this.value;
  }
}

addImpl('class assign this.props', { SampleA, SampleB });
