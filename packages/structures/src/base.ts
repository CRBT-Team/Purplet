export class Base {
  protected cached(key: string, value: any) {
    Object.defineProperty(this, key, { value, enumerable: true });
    return value;
  }

  todo(name: string): never {
    const e = new Error(`${name}`);
    e.name = 'NotImplementedError';
    throw e;
  }
}
