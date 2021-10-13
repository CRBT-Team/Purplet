export type ResolvesTo<X> = X | Promise<X> | (() => X | Promise<X>);

export async function resolve<X>(config: ResolvesTo<X>): Promise<X> {
  if (typeof config === "function") {
    return (config as any)();
  }
  return config;
}
