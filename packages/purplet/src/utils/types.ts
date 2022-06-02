export type Cleanup = (() => void) | undefined | void;
export type Module = Record<string, unknown>;

export type IsUnknown<T> = T extends
  | string
  | number
  | boolean
  | symbol
  | object
  | unknown[]
  | undefined
  ? false
  : true;
