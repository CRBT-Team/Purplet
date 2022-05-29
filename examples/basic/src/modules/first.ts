import { createFeature } from 'purplet';
import { number } from '../lib/depends';

export const test = createFeature('test', {
  async initialize({ featureId }) {
    console.log(`${featureId} is ${number}`);
  },
  async djsClient({ featureId, client }) {
    console.log(`${featureId} loaded and on ${client.user.tag}!!!`);
  },
});
