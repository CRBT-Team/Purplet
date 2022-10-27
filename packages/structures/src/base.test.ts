import { describe, expect, test } from 'bun:test';
import { Base } from './base';

describe('base', () => {
  test('cached()', () => {
    let i = 0;

    class Test extends Base {
      get test() {
        return this.cached('test', i++);
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
});
