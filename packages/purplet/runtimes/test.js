/* eslint-disable no-console */
import interactionFeatures from 'purplet/features/interaction';

// the goal of a "runtime" as i am calling it, is code that takes purplet features and
// makes it into a usable bot program. this runtime just prints out the list of interaction
// features. a real one could for example, start an express server.

console.log('interaction features: ', interactionFeatures);
