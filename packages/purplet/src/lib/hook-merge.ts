import { FEATURE, UnmarkedFeature } from './hook';

type Falsey = undefined | null | false | 0 | '';

export function $merge<Pass>(
  features: (UnmarkedFeature | Falsey)[],
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
