export function todo(desc: string): never {
  const e = new Error(desc);
  e.name = 'NotImplementedError';
  throw e;
}

export function cached(target: any, key: string, value: any) {
  Object.defineProperty(target, key, { value, enumerable: true });
  return value;
}
