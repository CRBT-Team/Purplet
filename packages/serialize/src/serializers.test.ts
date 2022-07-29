import * as S from './serializers';
import type { BitSerializer } from './BitSerializer';

function expectSerialize(serializer: BitSerializer<any>, value: any) {
  expect(serializer.check(value)).toBe(true);
  expect(serializer.decode(serializer.encode(value))).toEqual(value);
}

function expectFailCheck(serializer: BitSerializer<any>, value: any) {
  expect(serializer.check(value)).toBe(false);
}

describe('serializers', () => {
  test('boolean', () => {
    expect(S.boolean.check(true)).toBe(true);
    expect(S.boolean.check(false)).toBe(true);
    expect(S.boolean.check(null)).toBe(false);
    expectSerialize(S.boolean, true);
    expectSerialize(S.boolean, false);
  });
  test('constant', () => {
    const sym = Symbol('test');
    expect(S.constant(sym).encode(sym)).toEqual(new Uint8Array([]));
    expect(S.constant(sym).decode(new Uint8Array([]))).toStrictEqual(sym);
  });
  test('date', () => {
    const date = new Date();
    expect(S.date.encode(date)).toHaveLength(7);
    expect(S.date.decode(S.date.encode(date)).getTime()).toBe(date.getTime());
  });
  test('number', () => {
    expectSerialize(S.number, 0);
    expectSerialize(S.number, 1);
    expectSerialize(S.number, -1);
    expectSerialize(S.number, 1.5);
    expectSerialize(S.number, -1.5);
    expectSerialize(S.number, Number.MAX_SAFE_INTEGER);
    expectSerialize(S.number, Number.MIN_SAFE_INTEGER);
    expectSerialize(S.number, Number.MAX_SAFE_INTEGER + 1);
    expectSerialize(S.number, Number.MIN_SAFE_INTEGER - 1);
    expectSerialize(S.number, NaN);
    expectSerialize(S.number, Infinity);
    expectSerialize(S.number, -Infinity);
  });
  test('string', () => {
    expectSerialize(S.string, '');
    expectSerialize(S.string, 'a');
    expectSerialize(S.string, 'abc');
    expectSerialize(S.string, '💩');
  });
  test('array', () => {
    expectSerialize(S.arrayOf(S.number), []);
    expectSerialize(S.arrayOf(S.number), [1, 2, 3]);
    expectSerialize(S.arrayOf(S.number), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expectSerialize(S.arrayOf(S.string), ['a', 'beak', 'c']);
    expectSerialize(S.arrayOf(S.u16), [5341, 43, 61]);

    expectFailCheck(S.arrayOf(S.u16), [5341, -43, 61]);
    expectFailCheck(S.arrayOf(S.u16), ['5132', 43, 61]);
  });
  test('object', () => {
    const test1 = S.object({
      name: S.string,
      age: S.number,
      isCool: S.boolean,
    });

    expectSerialize(test1, { name: 'test', age: 1, isCool: true });
    expectSerialize(test1, { name: 'hello', age: 492, isCool: false });
    expectSerialize(test1, { name: '', age: -52.3, isCool: false });
  });
  test('object with nested stuff', () => {
    const test1 = S.object({
      name: S.string,
      age: S.number,
      stats: S.object({
        hp: S.number,
        mp: S.number,
        sp: S.number,
      }),
      friends: S.arrayOf(
        S.object({
          id: S.u8,
          name: S.string,
        })
      ),
    });

    expectSerialize(test1, {
      name: 'John',
      age: 14,
      stats: { hp: 100, mp: 50, sp: 0 },
      friends: [
        { id: 49, name: 'John' },
        { id: 25, name: 'Jane' },
      ],
    });
  });
  test('generic', () => {
    expectSerialize(S.generic, 1);
    expectSerialize(S.generic, -1);
    expectSerialize(S.generic, 1.5);
    expectSerialize(S.generic, -1.5);
    expectSerialize(S.generic, Number.MAX_SAFE_INTEGER);
    expectSerialize(S.generic, Number.MIN_SAFE_INTEGER);
    expectSerialize(S.generic, 'test');
    expectSerialize(S.generic, '💩');
    expectSerialize(S.generic, true);
    expectSerialize(S.generic, false);
    expectSerialize(S.generic, new Date());
    expectSerialize(S.generic, []);
    expectSerialize(S.generic, [1, 2, 3]);
    expectSerialize(S.generic, [1, null, true, { a: 1, b: 2 }]);
    expectSerialize(S.generic, { a: 1, b: 2, null: null, undefined });
    expectSerialize(S.generic, 5321n);
    expectSerialize(S.generic, -53421n);
    expectSerialize(S.generic, NaN);
    expectSerialize(S.generic, Infinity);
    expectSerialize(S.generic, -Infinity);
    expectSerialize(S.generic, '244905301059436545');
    expect(S.generic.encode('244905301059436545')).toHaveLength(9);
    expect(S.generic.encode('aaaaaaaaaaaaaaaaaa')).toHaveLength(20);
  });
});
