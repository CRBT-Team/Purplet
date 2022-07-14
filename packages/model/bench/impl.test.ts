import './implementations/class-assign-props';
import './implementations/class-with-raw';
import { describe, expect, test } from 'bun:test';
import { impls } from './shared';

for (const {
  name,
  impl: { SampleA, SampleB },
} of impls) {
  describe(name, () => {
    test('Constructors create proper data structures.', () => {
      const a = new SampleA({
        flag: true,
        id: '1',
        list: [
          {
            id: '3',
            value: 4,
          },
          {
            id: '4',
            value: 5,
          },
        ],
        name: 'foo',
        other_number: 2,
        snake_case: 1,
        sub_object: {
          id: '2',
          value: 3,
        },
      });
      expect(a.id).toBe('1');
      expect(a.name).toBe('foo');
      expect(a.camelCase).toBe(1);
      expect(a.otherNumber).toBe(2);
      expect(a.subObject.id).toBe('2');
      expect(a.subObject.value).toBe(3);
      expect(a.list.length).toBe(2);
      expect(a.list[0].id).toBe('3');
      expect(a.list[0].value).toBe(4);
      expect(a.list[1].id).toBe('4');
      expect(a.list[1].value).toBe(5);
      expect(a.flag).toBe(true);
    });

    function getSample() {
      return new SampleA({
        id: '1',
        name: 'foo',
        snake_case: 531521,
        other_number: 27123,
        sub_object: {
          id: '2',
          value: 3512,
        },
        list: [
          {
            id: '3',
            value: 4,
          },
          {
            id: '4',
            value: 542,
          },
        ],
        flag: true,
      });
    }

    test('multiplyNumbers()', () => {
      const a = getSample();
      expect(a.multiplyNumbers()).toBe(531521 * 27123);
    });
    test('multiplyCamelWithSubObject()', () => {
      const a = getSample();
      expect(a.multiplyCamelWithSubObject()).toBe(531521 * 3512);
    });
    test('sumOfList()', () => {
      const a = getSample();
      expect(a.sumOfList()).toBe(4 + 542);
    });
    test('sumOfSquaredList()', () => {
      const a = getSample();
      expect(a.sumOfSquaredList()).toBe(4 * 4 + 542 * 542);
    });
    test('multiplyListBy()', () => {
      const a = getSample();
      const b = a.multiplyListBy(2);
      expect(b.length).toBe(2);
      expect(b[0].id).toBe('3');
      expect(b[0].value).toBe(8);
      expect(b[1].id).toBe('4');
      expect(b[1].value).toBe(1084);

      const c = a.multiplyListBy(-532);
      expect(c.length).toBe(2);
      expect(c[0].id).toBe('3');
      expect(c[0].value).toBe(-4 * 532);
      expect(c[1].id).toBe('4');
      expect(c[1].value).toBe(-542 * 532);
    });
    test('squareSelf', () => {
      const a = getSample();
      expect(a.subObject.squareSelf()).toBe(3512 * 3512);

      const b = new SampleB({
        id: '1',
        value: 5,
      });
      expect(b.squareSelf()).toBe(25);
    });
  });
}
