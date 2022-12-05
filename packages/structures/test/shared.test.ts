import { expect, test } from 'bun:test';
import { cached } from '../src/shared';

test('cached()', () => {
  let i = 0;

  class Test {
    get test() {
      return cached(this, 'test', i++);
    }
  }
  const test1 = new Test();
  const test2 = new Test();

  expect(test1.test).toBe(0);
  expect(test1.test).toBe(0);

  expect(test2.test).toBe(1);
  expect(test2.test).toBe(1);

  expect(test1.test).toBe(0);
  expect(test2.test).toBe(1);
  expect(i).toBe(2);
});
