import { Handler } from '../Handler';

type RecursivePartialIgnore = Handler;

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends RecursivePartialIgnore ? T[P] : RecursivePartial<T[P]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Class<T> = new (...args: any[]) => T;
