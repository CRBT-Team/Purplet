import { mkdir, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const allowedFiles = [
  //
  '.git',
  '.gitignore',
  '.gitattributes',
  '.gitmodules',
  '.DS_Store',
  '.env',
];

/** Async copy recursive. */
export async function copy(
  src: string,
  dest: string,
  copySingleFile: (src: string, dest: string) => Promise<void>,
  ignore: string[] = []
) {
  const stats = await stat(src);
  if (stats.isDirectory()) {
    await mkdirp(dest);
    const allFiles = await readdir(src);
    const newFiles = allFiles.filter(file => !ignore.some(ignoreEntry => file === ignoreEntry));
    await Promise.all(
      newFiles.map(async file => {
        await copy(join(src, file), join(dest, file), copySingleFile, ignore);
      })
    );
  } else {
    await copySingleFile(src, dest);
  }
}

export async function checkEmpty(root: string | string[]) {
  const files = Array.isArray(root) ? root : await readdir(root);
  return files.every(file => allowedFiles.includes(file));
}

export async function mkdirp(mkdirRoot: string) {
  try {
    await mkdir(mkdirRoot, { recursive: true });
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}
