import { FEATURE, Feature, FeatureMetaData, Hook, HookType } from './hook';
import { asyncMap } from '../utils/promise';
import type { Cleanup } from '../utils/types';

export type MergeFunction<T> = (a: T[]) => T;
export type FeatureArrayResolvable = Feature[] | { features: Feature[] };

/**
 * Runs a data hook, given a list of features to operate on (may include non-matching hooks), the
 * hook, and a merge function to combine multiple entries. Returns the merged data.
 */
export async function runHook<Data>(
  allFeatures: FeatureArrayResolvable,
  hook: Hook<Data, 'data'>,
  merge: MergeFunction<Data>
): Promise<Data>;
/**
 * Runs a data hook, given a list of features to operate on (may include non-matching hooks), the
 * hook, and no function to combine multiple entries. Returns an array of data.
 */
export async function runHook<Data>(
  allFeatures: FeatureArrayResolvable,
  hook: Hook<Data, 'data'>
): Promise<Data>;
/**
 * Runs an event hook, given a list of features to operate on (may include non-matching hooks), the
 * hook, and the event data. Returns nothing.
 */
export async function runHook<Data>(
  allFeatures: FeatureArrayResolvable,
  hook: Hook<Data, 'event'>,
  event: Data
): Promise<void>;
/**
 * Runs a lifecycle hook, given a list of features to operate on (may include non-matching hooks),
 * the hook, and the event data. Returns a cleanup function.
 */
export async function runHook<Data>(
  allFeatures: FeatureArrayResolvable,
  hook: Hook<Data, 'lifecycle'>,
  event: Data
): Promise<Cleanup>;
/**
 * **Extra overload for mixed-type hooks.**
 *
 * Runs a hook, given a list of features to operate on (may include non-matching hooks), the hook,
 * and either the event data or a merge function, based on the type of hook. Returns different
 * things based on the hook type.
 */
export async function runHook<Data>(
  allFeatures: FeatureArrayResolvable,
  hook: Hook<Data, HookType>,
  event?: Data | MergeFunction<Data>
): Promise<Cleanup>;
// Implementation:
export async function runHook<Data, Type extends HookType>(
  features: FeatureArrayResolvable,
  hook: Hook<Data, Type>,
  extraArg?: Data | MergeFunction<Data>
) {
  const rawList = Array.isArray(features) ? features : features.features;
  const list = rawList.filter(feature => feature[FEATURE].hook === hook.id);

  if (hook.type === 'data') {
    const values = await asyncMap(list, feature =>
      typeof feature[FEATURE].data === 'function'
        ? feature[FEATURE].data.call(feature)
        : feature[FEATURE].data
    );

    return extraArg ? (extraArg as MergeFunction<Data>)(values) : values;
  }

  if (hook.type === 'event') {
    return Promise.all(
      list.map(feature =>
        (feature[FEATURE] as FeatureMetaData<unknown, 'event'>).data.call(feature, extraArg)
      )
    );
  }

  if (hook.type === 'lifecycle') {
    const allCleanup = await asyncMap(list, feature =>
      (feature[FEATURE] as FeatureMetaData<unknown, 'lifecycle'>).data.call(feature, extraArg)
    );
    return () => {
      for (const cleanup of allCleanup) {
        cleanup?.();
      }
    };
  }

  throw new Error('unsupported hook type: ' + hook.type);
}
