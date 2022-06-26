import type { Awaitable } from '@davecode/types';

export function asyncMap<T, R>(input: Iterable<T>, mapper: (item: T, i: number) => Awaitable<R>) {
  return Promise.all([...input].map(mapper));
}
