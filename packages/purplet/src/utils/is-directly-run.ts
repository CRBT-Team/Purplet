import url from 'url';
import { createRequire } from 'module';

/**
 * @internal Helper for the built bot, edge case handling for checking if the current js file is
 * the one that Node.js ran
 */
export function isDirectlyRun(myself: string) {
  if (typeof process === 'undefined' || !process) {
    return false;
  }

  // bunjs workaround
  if (process.argv.length === 0) {
    return true;
  }

  // A full resolve is required in some node.js specific resolve cases.
  const require = createRequire(import.meta.url.toString());
  const entry = url.pathToFileURL(require.resolve(process.argv[1])).href;

  return entry === myself;
}
