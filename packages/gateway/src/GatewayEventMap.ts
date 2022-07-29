import type { GatewayDispatchEvents, GatewayDispatchPayload } from 'discord-api-types/gateway';

export type GatewayEventMap = {
  // star event for full payloads of everything
  '*': GatewayDispatchPayload;
  // passthrough websocket and gateway disconnect errors
  error: Error;
  //
  debug: string;
} & {
  // map every discord-api-types event to its key and extract the data from it's DataPayload<Key, Data>
  // the approach here is a bit extensive due to how union types work in typescript
  [K in GatewayDispatchEvents as `${K}`]: GatewayDispatchPayload extends { t: infer Type }
    ? Type extends K
      ? Extract<GatewayDispatchPayload, { t: K }> extends { d: infer Data }
        ? Data
        : never
      : never
    : never;
};
