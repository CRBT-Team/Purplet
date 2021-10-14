import fs from 'fs-extra';
import path from 'path';

export async function getTempFolder(): Promise<string> {
  const dir = path.join(process.cwd(), 'dist');
  await fs.ensureDir(dir);
  return dir;
}
