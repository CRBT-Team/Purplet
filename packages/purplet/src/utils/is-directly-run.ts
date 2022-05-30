import url from 'url';

/**
 * @internal Helper for the built bot, edge case handling for checking if the current js file is
 * the one that Node.js ran
 */
export function isDirectlyRun(myself: string) {
  if (typeof process === 'undefined' || !process) {
    return false;
  }
  const entry = url.pathToFileURL(process.argv[1]).href;
  return entry === myself || myself.replace(/[/\\]index\.[mc]?js$/, '') === entry;
}
