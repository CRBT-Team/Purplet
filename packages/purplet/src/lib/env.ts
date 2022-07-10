export function getEnvVar(name: string): string | null {
  return process.env[name] ?? null;
}
