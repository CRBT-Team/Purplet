import fs from 'fs-extra';
import path from 'path';

export async function readDirRecursive(dir: string): Promise<string[]> {
  const files = await fs.readdir(dir);
  const dirs = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        return readDirRecursive(filePath);
      }
      return [filePath];
    })
  );

  return dirs.flat();
}
