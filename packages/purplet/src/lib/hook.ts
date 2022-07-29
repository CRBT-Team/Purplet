import type { Awaitable } from '@davecode/types';
import type { Cleanup } from '../utils/types';

export const FEATURE = Symbol.for('purplet.feature-data');

export interface UserMetadata {}

/** Represents a fully annotated feature. */
export interface Feature {
  [FEATURE]: FeatureInternalData;
  /** The full path to this module's source file. */
  filename: string;
  /** The id of the export that contained this feature. */
  exportId: string;
  /** A generated ID based on the `filename` and `exportId`. */
  featureId: string;
  /** User Defined Metadata. */
  meta?: UserMetadata;
}

export interface FeatureInternalData<HookData = unknown, Type extends HookType = HookType> {
  data: HookInput<HookData, Type>;
  hook: Hook<HookData, Type>;
}

export type UnmarkedFeature<Pass = Record<never, unknown>> = {
  [FEATURE]: FeatureInternalData;
  /** User Defined Metadata. */
  meta?: UserMetadata;
} & Pass &
  Record<never, never>;

export type HookType = 'data' | 'event' | 'lifecycle';

export interface CreateHookData<Type extends HookType> {
  id: string;
  /**
   * Hook type.
   *
   * - Data: non-function data that is resolved and passed to the hook.
   * - Event: a function that is called multiple times.
   * - Lifecycle: a function that is called once, and may have a cleanup function.
   */
  type: Type;
}

export interface HookHotUpdate<HookData> {
  /** Full list of all feature data. */
  data: HookData[];
  /** List of features that were added. */
  added: HookData[];
  /** List of features that were removed. */
  removed: HookData[];
}

export interface Hook<HookData, Type extends HookType> extends CreateHookData<Type> {
  <Pass>(data: HookInput<HookData, Type>, passthrough?: Pass): UnmarkedFeature<Pass>;
  merge?: boolean;
}

export type HookInput<HookData, Type extends HookType> = Type extends 'data'
  ? HookData | HookData[] | ((this: Feature) => Awaitable<HookData | HookData[]>)
  : Type extends 'event'
  ? (this: Feature, event: HookData) => void
  : Type extends 'lifecycle'
  ? (this: Feature, event: HookData) => Awaitable<void | Cleanup>
  : never;

export function createCoreHook<Data, Type extends HookType>(
  data: CreateHookData<Type>
): Hook<Data, Type> {
  const hook: any = <X>(
    instance: Data | (() => Awaitable<Data>),
    passthrough?: X & { meta?: Partial<UserMetadata> }
  ): UnmarkedFeature<X> =>
    ({
      [FEATURE]: {
        data: instance,
        hook,
      },
      ...passthrough,
    } as UnmarkedFeature<X>);

  Object.defineProperty(hook, 'name', {
    value: `hook:${data.id}`,
  });
  hook.id = data.id;
  hook.type = data.type;
  return hook as Hook<Data, Type>;
}
