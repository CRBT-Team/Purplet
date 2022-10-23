import { polyfill } from './polyfill.mjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
polyfill(require);
