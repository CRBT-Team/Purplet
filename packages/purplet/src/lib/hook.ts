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
  hook: Hook<HookData, Type> | 'core' | 'merge';
}

export type MarkedFeature<Pass = Record<never, unknown>> = {
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
   * Run on initial ALL load, given a list of feature data. You can also return an array of other
   * features if your hook needs to do that.
   */
  load?(hooks: HookData[]): Promise<void | MarkedFeature[]>;
  /** Run to unload ALL hooks, given a list of feature data. */
  unload?(hooks: HookData[]): Promise<void>;
  /**
   * For HMR, this is called with a new array plus added/removed. If not specified, the unload and
   * load function will be used instead. If specified, those other functions will only be called to
   * setup and teardown the entire hook.
   */
  hotUpdate?(update: HookHotUpdate<HookData>): Promise<MarkedFeature[]>;
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
  <Pass>(data: HookInput<HookData, Type>, passthrough?: Pass): MarkedFeature<Pass>;
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
  ): MarkedFeature<X> => {
    return {
      [FEATURE]: {
        data: instance,
        hook: (data as any).core ? 'core' : data.id,
      },
      ...passthrough,
    } as MarkedFeature<X>;
  };

  Object.defineProperty(hook, 'name', {
    value: `hook:${data.id}`,
  });
  hook.id = data.id;
  hook.load = data.load;
  hook.unload = data.unload;
  hook.hotUpdate = data.hotUpdate;
  return hook as Hook<Data, Type>;
}
