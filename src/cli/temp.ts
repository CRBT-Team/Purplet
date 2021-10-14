import path from "path";
import fs from "fs-extra";

export async function getTempFolder(): Promise<string> {
  const dir = path.join(process.cwd(), ".purplet");
  await fs.ensureDir(dir);
  return dir;
}
