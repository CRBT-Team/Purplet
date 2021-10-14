import { config as setupDotEnv } from 'dotenv';
import { install as setupSourceMaps } from 'source-map-support';
import { setupPrettyErrors } from './pretty-error';

export function setupEnv() {
  setupDotEnv();
  setupSourceMaps();
  setupPrettyErrors();
}
