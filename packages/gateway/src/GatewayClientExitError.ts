import { GatewayCloseCodes } from 'discord-api-types/gateway';

export class GatewayClientExitError extends Error {
  constructor(public code: GatewayCloseCodes) {
    super(`Gateway disconnected with code: ${code}`);
  }
}
