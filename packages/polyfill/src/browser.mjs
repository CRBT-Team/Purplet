// Some browsers do not support structured clone.
import structuredClone from '@ungap/structured-clone';

if (!globalThis.structuredClone) {
  globalThis.structuredClone = structuredClone;
}

// The rest of the features do not apply to browsers, as they
// all have native support or don't make sense to include.
