declare module '$$config' {
  const config: import('./src/config/types').RuntimeConfig;
  export default config;
}

declare module '$$features' {
  const features: Array<import('./src/lib/hook').Feature>;
  export default features;
}

declare module '$$features/*' {
  const features: Array<import('./src/lib/hook').Feature>;
  export default features;
}

declare module '$$runtime' {
  const data: typeof import('./src/lib/GatewayBot') &
    Pick<typeof import('./src/lib/env'), 'setGlobalEnv'>;
  export = data;

  export type GatewayBotOptions = import('./src/lib/GatewayBot').GatewayBotOptions;
}
