export function isSourceFile(filename: string): boolean {
  // I don't know why you would ever use JSX in this... but it will be detected.
  return /\.[jt]sx?$/.test(filename);
}
