type ResolvableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<ResolvableValue>
  | Record<PropertyKey, unknown>;

export type Resolvable<X extends ResolvableValue> = X | Promise<X> | (() => X | Promise<X>);

export async function resolve<X extends ResolvableValue>(config: Resolvable<X>): Promise<X> {
  if (typeof config === 'function') {
    return config();
  }
  return config;
}
