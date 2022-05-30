import fs from 'fs/promises';
import path from 'path';

export async function walk(root: string): Promise<string[]> {
  const files = await fs.readdir(root, { withFileTypes: true });
  const paths = await Promise.all(
    files.map(async file => {
      const filename = path.join(root, file.name);
      if (file.isDirectory()) {
        return walk(filename);
      }
      return path.normalize(filename);
    })
  );
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
