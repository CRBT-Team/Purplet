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

declare module '$$adapter' {
  const data: typeof import('./src/lib/GatewayBot') &
    Pick<typeof import('./src/lib/env'), 'setGlobalEnv' | 'setRestOptions'>;
  export = data;

  export type GatewayBotOptions = import('./src/lib/GatewayBot').GatewayBotOptions;

  export function handleInteraction(
    i: import('discord-api-types/v10').APIInteraction
  ): Promise<import('discord-api-types/v10').APIInteractionResponse>;
}

declare module '*entrypoint.ts' {
  const data: string;
  export default data;
}
