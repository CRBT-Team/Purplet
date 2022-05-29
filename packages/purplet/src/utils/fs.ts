import fs from 'fs/promises';
import path from 'path';

export async function walk(root: string): Promise<string[]> {
  const files = await fs.readdir(root, { withFileTypes: true });
  const paths = await Promise.all(
    files.map(async file => {
      const filePath = path.join(root, file.name);
      if (file.isDirectory()) {
        return walk(filePath);
      }
      return path.normalize(filePath);
    })
  );
  return paths.flat();
}
