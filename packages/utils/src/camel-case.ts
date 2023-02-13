export type CamelCase<T> = T extends `${infer A}_${infer B}`
  ? `${A}${Capitalize<CamelCase<B>>}`
  : T;
export type ShallowCamelCaseObj<T> = T extends Dict<unknown>
  ? {
      [K in keyof T as CamelCase<K>]: T[K];
    }
  : T;
