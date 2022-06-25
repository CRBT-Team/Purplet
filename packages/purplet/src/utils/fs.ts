import fs from 'fs/promises';
import path from 'path';
import type { Dirent } from 'fs';
import { asyncMap } from './promise';
import { createRequire } from 'module';

export async function walk(root: string): Promise<string[]> {
  const files = await fs.readdir(root, { withFileTypes: true });
  const paths = await asyncMap<Dirent, string | string[]>(files, file => {
    const filename = path.join(root, file.name);
    if (file.isDirectory()) {
      return walk(filename);
    }
    return path.normalize(filename);
  });
  return paths.flat();
}

export async function exists(filename: string): Promise<boolean> {
  try {
    await fs.access(filename);
    return true;
  } catch (e) {
    return false;
  }
}

export const purpletSourceCode = path
  .dirname(createRequire(import.meta.url).resolve('purplet'))
  .replace(/\\/g, '/');
