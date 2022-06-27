// TODO: This function's types

import { createFeature, FeatureData } from '../lib/feature';

export function $interaction(handler: FeatureData['interaction']) {
  return createFeature({
    interaction: handler,
  });
}
