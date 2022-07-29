import type { Dict } from '@paperdave/utils';

export type CamelCase<T> = T extends `${infer A}_${infer B}`
  ? `${A}${Capitalize<CamelCase<B>>}`
  : T;

export type CamelCasedValue<T> = T extends Dict<unknown>
  ? {
      [K in keyof T as CamelCase<K>]: T[K];
    }
  : T;

export type CamelCasedValueRec<T> = T extends Record<PropertyKey, unknown>
  ? {
      [K in keyof T as CamelCase<K>]: CamelCasedValueRec<T[K]>;
    }
  : T extends Array<infer I>
  ? Array<CamelCasedValue<I>>
  : T;

function isPlainObj(value: unknown): value is Record<PropertyKey, unknown> {
  if (typeof value !== 'object' || value == null) {
    return false;
  }
  const obj = {};
  return Object.getPrototypeOf(value) === Object.getPrototypeOf(obj);
}

export function uncamelCase<T>(value: CamelCasedValue<T>): T {
  if (isPlainObj(value)) {
    const obj: Record<PropertyKey, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      obj[typeof k === 'string' ? k.replace(/[A-Z]/g, '_$&').toLowerCase() : k] = v;
    }
    return obj as any;
  }
  if (Array.isArray(value)) {
    return value.map(uncamelCase) as any;
  }
  return value as any;
}

export function uncamelCaseRec<T>(value: CamelCasedValue<T>): T {
  if (isPlainObj(value)) {
    const obj: Record<PropertyKey, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      obj[typeof k === 'string' ? k.replace(/[A-Z]/g, '_$&').toLowerCase() : k] = uncamelCaseRec(v);
    }
    return obj as any;
  }
  if (Array.isArray(value)) {
    return value.map(uncamelCase) as any;
  }
  return value as any;
}
