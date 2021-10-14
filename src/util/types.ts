import { Handler } from '../Handler';

type RecursivePartialIgnore = Handler;

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends RecursivePartialIgnore ? T[P] : RecursivePartial<T[P]>;
};

export type Class<T> = new (...args: unknown[]) => T;
