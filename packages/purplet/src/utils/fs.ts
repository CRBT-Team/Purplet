import path from 'path';
import { asyncMap } from '@paperdave/utils';
import type { Dirent } from 'fs';
import { access, mkdir, readdir, stat, writeFile } from 'fs/promises';
import { createRequire } from 'module';

export async function walk(root: string): Promise<string[]> {
  const files = await readdir(root, { withFileTypes: true });
  const paths = await asyncMap<Dirent, string | string[]>(files, file => {
    const filename = path.join(root, file.name);
    if (file.isDirectory()) {
      return walk(filename);
    }
    return path.normalize(filename);
  });
  return paths.flat();
}

export async function exists(filename: string) {
  try {
    await access(filename);
    return true;
  } catch (e) {
    return false;
  }
}

export async function mkdirp(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (e: any) {
    if (e.code === 'EEXIST') {
      return;
    }
    throw e;
  }
}

export const purpletSourceCode = path
  .dirname(createRequire(import.meta.url).resolve('purplet'))
  .replace(/\\/g, '/');

/** @type {Map<string, string>} */
const previous_contents = new Map();

export async function writeIfChanged(file: string, code: string) {
  if (code !== previous_contents.get(file)) {
    await writeStoreChanges(file, code);
  }
}

/**
 * @param {string} file
 * @param {string} code
 */
export async function writeStoreChanges(file: string, code: string) {
  previous_contents.set(file, code);
  await mkdirp(path.dirname(file));
  await writeFile(file, code);
}

export function posixify(str: string) {
  return str.replace(/\\/g, '/');
}

/**
 * Given an entry point like [cwd]/src/hooks, returns a filename like [cwd]/src/hooks.js or
 * [cwd]/src/hooks/index.js.
 */
export async function resolveEntrypoint(entry: string): Promise<string | null> {
  if (await exists(entry)) {
    const stats = await stat(entry);
    if (stats.isDirectory()) {
      return await resolveEntrypoint(path.join(entry, 'index'));
    }

    return entry;
  }
  const dir = path.dirname(entry);

  if (!(await exists(dir))) {
    const base = path.basename(entry);
    const files = await readdir(dir);

    const found = files.find(file => file.replace(/\.[^.]+$/, '') === base);

    if (found) {
      return path.join(dir, found);
    }
  }

  return null;
}

export async function isDirectory(file: string) {
  try {
    const stats = await stat(file);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}
