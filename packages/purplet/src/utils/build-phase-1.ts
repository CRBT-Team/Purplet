import type { Dict } from '@paperdave/utils';
import type { Feature } from '../lib/hook';
import { FEATURE } from '../lib/hook';

/** FeatureScan[hookID][filename] = [list of export ids] */
export type FeatureScan = Dict<Record<string, string[]>>;

export function printPhase1Data(features: Feature[]) {
  const files: FeatureScan = {};
  for (const feat of features) {
    const inner = feat[FEATURE].hook.merge ? (feat[FEATURE].data as Feature[]) : [feat];

    for (const innerFeat of inner) {
      const hookId = innerFeat[FEATURE].hook.id;

      files[hookId] ??= {};
      files[hookId][feat.filename] ??= [];
      files[hookId][feat.filename].push(innerFeat.exportId);
    }
  }

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(files, null, process.env.DEBUG ? 2 : undefined));
  process.exit(0);
}
