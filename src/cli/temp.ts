export async function getTempFolder(): Promise<string> {
  const envTemp = process.env.TEMP_FOLDER || process.env.TEMP || process.env.TMP;
  if (!envTemp) {
    throw new Error("TEMP environment variable not set");
  }
  return envTemp;
}
