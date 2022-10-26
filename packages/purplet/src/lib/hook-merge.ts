import type { UnmarkedFeature } from './hook';
import { FEATURE } from './hook';

type Falsey = undefined | null | false | 0 | '';

export function $merge<Pass>(
  features: Array<UnmarkedFeature | Falsey>,
  passthrough?: Pass
): UnmarkedFeature<Pass> {
  const allHookData = features
    .filter(Boolean as unknown as (x: any) => x is UnmarkedFeature)
    .map(feat => (feat[FEATURE].hook.merge ? feat[FEATURE].data : [feat]))
    .flat();

  return {
    ...passthrough,
    [FEATURE]: {
      hook: { merge: true },
      data: allHookData,
    },
  } as UnmarkedFeature<Pass>;
}

export function unmerge(mergeHook: any) {
  return mergeHook[FEATURE].data;
}
