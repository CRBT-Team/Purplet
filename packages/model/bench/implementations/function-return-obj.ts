import { addImpl, RawSampleA, RawSampleB } from '../shared';

function SampleA(raw: RawSampleA) {
  return {
    raw,
    id: raw.id,
    name: raw.name,
    camelCase: raw.snake_case,
    otherNumber: raw.other_number,
    subObject: SampleB(raw.sub_object),
    list: raw.list.map(item => SampleB(item)),
    flag: raw.flag,
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
      return this.list.map(item => SampleB({ ...item.raw, value: item.value * n }));
    },
  };
}

function SampleB(raw: RawSampleB) {
  return {
    raw,
    id: raw.id,
    value: raw.value,
    squareSelf() {
      return this.value * this.value;
    },
  };
}

addImpl('func return object', {
  SampleA: raw => SampleA(raw),
  SampleB: raw => SampleB(raw),
});
