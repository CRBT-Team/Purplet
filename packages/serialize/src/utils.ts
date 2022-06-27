export function fillArray<T>(length: number, cb: (index: number) => T): T[] {
  const arr = new Array(length);
  for (let i = 0; i < length; i++) {
    arr[i] = cb(i);
  }
  return arr;
}

export type Generic =
  | string
  | number
  | boolean
  | bigint
  | Date
  | null
  | undefined
  | Generic[]
  | { [key: string]: Generic };
