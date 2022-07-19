import { EmptyObject, ForceSimplify } from '@davecode/types';

type RawDefault = Record<unknown, unknown>;

type Prop<Type, Deps extends string> = [Type, Deps];

type RemoveNeverProperties<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};
type DefinedKeys<T> = keyof {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

type Copy<Raw extends RawDefault, K extends keyof Raw, To extends string> = Record<
  To,
  Prop<Raw[K], K>
>;

type InternalPick<Raw extends RawDefault, Out = EmptyObject, Pick extends keyof Raw> = {
  readonly raw: Pick<Raw, Pick>;
} & RemoveNeverProperties<{
  readonly [K in keyof Out]: Out[K] extends Prop<infer Type, infer Deps>
    ? (Deps extends Pick ? 'true' : 'false') extends 'true'
      ? Type
      : never
    : never;
}>;

type MapMethod<Method> = Method extends (self: infer Self, ...args: infer Args) => infer Return
  ? (...args: Args) => Return
  : never;

interface Model<Raw extends RawDefault, Out = EmptyObject> {
  copy<K extends keyof Raw>(prop: K): Model<Raw, Out & Copy<Raw, K, K>>;
  copy<K extends keyof Raw, To extends string>(prop: K, to: To): Model<Raw, Out & Copy<Raw, K, To>>;

  get<K extends string, Deps extends keyof Raw, T>(
    prop: K,
    deps: Deps[],
    getter: (self: InternalPick<Raw, Out, Deps>) => T
  ): Model<Raw, Out & Record<K, Prop<T, Deps>>>;

  method<
    K extends string,
    Deps extends keyof Raw,
    Method extends (self: InternalPick<Raw, Out, Deps>, ...args: any[]) => T
  >(
    prop: K,
    deps: Deps[],
    method: Method
  ): Model<Raw, Out & Record<K, Prop<MapMethod<Method>, Deps>>>;
}

type ModelGen<Raw = RawDefault, Out = EmptyObject> = (
  input: Model<Raw, EmptyObject>
) => Model<Raw, Out>;

type ModelClass<Raw = RawDefault, Out = EmptyObject, Picked = keyof Raw> = {
  new (raw: Raw): InternalPick<Raw, Out, Picked>;
} & {
  pick<Keys extends keyof Raw>(keys: Keys[]): ModelClass<Pick<Raw, Keys>, Out, Keys>;
  omit<Keys extends keyof Raw>(
    keys: Keys[]
  ): ModelClass<Omit<Raw, Keys>, Out, Exclude<keyof Raw, Keys>>;
};

function createModel<Raw, Out>(generator: ModelGen<Raw, Out>): ModelClass<Raw, ForceSimplify<Out>>;

type GetRawKeys<M extends ModelClass> = M extends ModelClass<infer Raw, unknown>
  ? { [K in keyof Raw]: K }[keyof Raw]
  : never;

type ModelPick<M extends ModelClass, Props extends GetRawKeys<ModelClass>> = M extends ModelClass<
  infer Raw,
  infer Out
>
  ? {}
  : never;
