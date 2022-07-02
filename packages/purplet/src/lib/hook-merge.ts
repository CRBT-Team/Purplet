import { FEATURE, MarkedFeature } from './hook';

export function $merge<Pass>(features: MarkedFeature[], passthrough?: Pass): MarkedFeature<Pass> {
  const allHookData = features
    .map(feat => (feat[FEATURE].hook === 'merge' ? feat[FEATURE].data : [feat]))
    .flat();

  return {
    ...passthrough,
    [FEATURE]: {
      hook: 'merge',
      data: allHookData,
    },
  } as MarkedFeature<Pass>;
}
