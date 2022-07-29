import type { Class } from '@paperdave/utils';

declare const HIDDEN: unique symbol;

/**
 * A partial class is a (fake) type that restricts the visible properties of a class, but with the
 * ability to pass a partial object to the constructor. It assumes the raw data is kept in a
 * readonly variable `raw`.
 *
 * Example usage:
 *
 * ```ts
 * type MessagePartial = PartialClass<typeof Message, 'id', 'fetch' | 'createdAt'>;
 * const MessagePartial = createPartialClass<MessagePartial>(Message);
 * ```
 */
export type PartialClass<
  T extends Class<any>,
  PickedRawProperties extends keyof ConstructorParameters<T>[0],
  SupportedPartialMethods extends keyof InstanceType<T>
> = Pick<InstanceType<T>, SupportedPartialMethods> & {
  readonly raw: Pick<ConstructorParameters<T>[0], PickedRawProperties>;
  [HIDDEN]: [T, PickedRawProperties, SupportedPartialMethods];
};

type GetRestArgs<C> = C extends new (arg0: any, ...args: infer R) => any ? R : never;

/** @see `PartialClass` */
export function createPartialClass<T>(
  c: any
): T extends PartialClass<infer C, infer PickedRawProperties, any>
  ? new (
      partialData: Pick<ConstructorParameters<C>[0], PickedRawProperties>,
      ...restArgs: GetRestArgs<C>
    ) => T
  : never {
  return c;
}

export function createInstanceofGuard<T>(def: Class<T>) {
  return (obj => obj instanceof def) as (obj: unknown) => obj is T;
}
