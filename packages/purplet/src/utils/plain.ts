/** Represents a plain object, as in the potential return value from `JSON.parse`. No functions or classes. */
// @ts-expect-error infinite recursion error but it functions otherwise.
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JSONValue[]
  | Record<string, JSONValue>;

/**
 * Given a plain object type, gives you a version where any nested property can be an object with a
 * `toJSON` function, that resolves to the correct type. You can resolve these objects with
 * `toPlain`, or just pass them to `JSON.stringify`, as that function handles `.toJSON()` nativly.
 */
export type JSONResolvable<Target extends JSONValue> =
  | { toJSON(): JSONResolvable<Target> }
  | (Target extends Array<infer V>
      ? JSONResolvable<V>[]
      : Target extends Record<string, JSONValue>
      ? { [K in keyof Target]: JSONResolvable<Target[K]> }
      : Target);

/**
 * Resolves a non-plain object to a plain one. See `Plain` and `PlainResolvable`. Somewhat faster
 * than `JSON.parse(JSON.stringify(data))`.
 */
export function toJSONValue<T extends JSONValue>(o: JSONResolvable<T>): T {
  if (Array.isArray(o)) {
    return (o as any).map(toJSONValue);
  } else if (o && typeof o === 'object') {
    if (typeof (o as any).toJSON === 'function') {
      return toJSONValue((o as any).toJSON());
    }

    const copy: JSONValue = {};
    for (const prop in o) {
      copy[prop] = toJSONValue((o as any)[prop]);
    }
    return copy;
  }
  return o;
}
