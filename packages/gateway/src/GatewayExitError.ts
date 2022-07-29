import type { GatewayCloseCodes } from 'discord-api-types/gateway';

export class GatewayExitError extends Error {
  constructor(public code: GatewayCloseCodes) {
    super(`Gateway disconnected with code: ${code}`);
  }
}
