export type PermissionResolve = string | bigint | (string | bigint)[];

export function resolvePermission(permissions: PermissionResolve): string {
  if (typeof permissions === 'string') {
    return permissions;
  }
  if (typeof permissions === 'bigint') {
    return permissions.toString();
  }
  return permissions
    .flat()
    .map(x => (typeof x === 'string' ? BigInt(x) : x))
    .reduce((a, b) => a | b)
    .toString();
}
