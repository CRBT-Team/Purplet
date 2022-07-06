import type { Awaitable } from '@davecode/types';
import type { Cleanup } from '../utils/types';

export const FEATURE = Symbol.for('purplet.feature-data');

/** Represents a fully annotated feature. */
export interface Feature {
  [FEATURE]: FeatureMetaData;
  /** The full path to this module's source file. */
  filename: string;
  /** The id of the export that contained this feature. */
  exportId: string;
  /** A generated ID based on the `filename` and `exportId`. */
  featureId: string;
}

export interface FeatureMetaData<HookData = unknown, Type extends HookType = HookType> {
  data: HookInput<HookData, Type>;
  hook: Hook<HookData, Type>;
}

export type UnmarkedFeature<Pass = Record<never, unknown>> = {
  [FEATURE]: FeatureMetaData;
} & Pass &
  Record<never, never>;

export type HookType = 'data' | 'event' | 'lifecycle';

export interface CreateHookData<HookData, Type extends HookType> {
  id: string;
  /**
   * Hook type.
   *
   * - Data: non-function data that is resolved and passed to the hook.
   * - Event: a function that is called multiple times.
   * - Lifecycle: a function that is called once, and may have a cleanup function.
   */
  type: Type;
  /**
   * TLDR: do not specify or set to false.
   *
   * If set to true, this acts a core hook. Core hooks are handled by the core runtime, and not by
   * the hook itself. Hook events will not be run in this mode.
   */
  core?: boolean;
  /**
   * Custom Hook API: Given a list of feature data. You can also return an array of other features
   * if your hook needs to do that.
   *
   * This API is pretty stupid and has some huge limitations, and is only designed to facilitate the
   * custom application command merging that $slashCommandGroup requires.
   */
  transformDataToMoreHooks?(hooks: HookData[]): Promise<void | UnmarkedFeature | UnmarkedFeature[]>;
}

export interface HookHotUpdate<HookData> {
  /** Full list of all feature data. */
  data: HookData[];
  /** List of features that were added. */
  added: HookData[];
  /** List of features that were removed. */
  removed: HookData[];
}

export interface Hook<HookData, Type extends HookType> extends CreateHookData<HookData, Type> {
  <Pass>(data: HookInput<HookData, Type>, passthrough?: Pass): UnmarkedFeature<Pass>;
  merge?: boolean;
}

export type HookInput<HookData, Type extends HookType> = Type extends 'data'
  ? HookData | ((this: Feature) => Awaitable<HookData | HookData[]>)
  : Type extends 'event'
  ? (this: Feature, event: HookData) => void
  : Type extends 'lifecycle'
  ? (this: Feature, event: HookData) => Awaitable<void | Cleanup>
  : never;

export function createHook<Data, Type extends HookType>(
  data: CreateHookData<Data, Type>
): Hook<Data, Type> {
  const hook: any = <X>(
    instance: Data | (() => Awaitable<Data>),
    passthrough?: X
  ): UnmarkedFeature<X> => {
    return {
      [FEATURE]: {
        data: instance,
        hook,
      },
      ...passthrough,
    } as UnmarkedFeature<X>;
  };

  Object.defineProperty(hook, 'name', {
    value: `hook:${data.id}`,
  });
  hook.id = data.id;
  hook.type = data.type;
  hook.core = data.core;
  hook.load = data.transformDataToMoreHooks;
  return hook as Hook<Data, Type>;
}
