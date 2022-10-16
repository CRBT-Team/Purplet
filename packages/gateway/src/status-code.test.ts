import { describe, expect, test } from 'bun:test';
import { GatewayCloseCodes } from 'discord-api-types/v10';
import { getWSCodeDisplayName } from './status-code';

describe('getWSCodeDisplayName', () => {
  test('formats all status codes correctly', () => {
    expect(getWSCodeDisplayName(1000)).toBe('Normal Closure');
    expect(getWSCodeDisplayName(1001)).toBe('Going Away');
    expect(getWSCodeDisplayName(1002)).toBe('Protocol error');
    expect(getWSCodeDisplayName(1003)).toBe('Unsupported Data');
    expect(getWSCodeDisplayName(1004)).toBe('Reserved');
    expect(getWSCodeDisplayName(1005)).toBe('No Status Rcvd');
    expect(getWSCodeDisplayName(1006)).toBe('Abnormal Closure');
    expect(getWSCodeDisplayName(1007)).toBe('Invalid Frame Payload Data');
    expect(getWSCodeDisplayName(1008)).toBe('Policy Violation');
    expect(getWSCodeDisplayName(1009)).toBe('Message Too Big');
    expect(getWSCodeDisplayName(1010)).toBe('Mandatory Ext.');
    expect(getWSCodeDisplayName(1011)).toBe('Internal Error');
    expect(getWSCodeDisplayName(1012)).toBe('Service Restart');
    expect(getWSCodeDisplayName(1013)).toBe('Try Again Later');
    expect(getWSCodeDisplayName(1014)).toBe('Invalid Gateway');
    expect(getWSCodeDisplayName(1015)).toBe('TLS Handshake Error');
    expect(getWSCodeDisplayName(GatewayCloseCodes.UnknownError)).toBe('Unknown Error');
    expect(getWSCodeDisplayName(GatewayCloseCodes.UnknownOpcode)).toBe('Unknown Opcode');
    expect(getWSCodeDisplayName(GatewayCloseCodes.DecodeError)).toBe('Decode Error');
    expect(getWSCodeDisplayName(GatewayCloseCodes.NotAuthenticated)).toBe('Not Authenticated');
    expect(getWSCodeDisplayName(GatewayCloseCodes.AuthenticationFailed)).toBe(
      'Authentication Failed'
    );
    expect(getWSCodeDisplayName(GatewayCloseCodes.AlreadyAuthenticated)).toBe(
      'Already Authenticated'
    );
    expect(getWSCodeDisplayName(GatewayCloseCodes.InvalidSeq)).toBe('Invalid Seq');
    expect(getWSCodeDisplayName(GatewayCloseCodes.RateLimited)).toBe('Rate Limited');
    expect(getWSCodeDisplayName(GatewayCloseCodes.SessionTimedOut)).toBe('Session Timed Out');
    expect(getWSCodeDisplayName(GatewayCloseCodes.InvalidShard)).toBe('Invalid Shard');
    expect(getWSCodeDisplayName(GatewayCloseCodes.ShardingRequired)).toBe('Sharding Required');
    expect(getWSCodeDisplayName(GatewayCloseCodes.InvalidAPIVersion)).toBe('Invalid API Version');
    expect(getWSCodeDisplayName(GatewayCloseCodes.InvalidIntents)).toBe('Invalid Intents');
    expect(getWSCodeDisplayName(GatewayCloseCodes.DisallowedIntents)).toBe('Disallowed Intents');
  });
  test('formats unknown numbers', () => {
    expect(getWSCodeDisplayName(5931)).toBe('Unknown Error');
    expect(getWSCodeDisplayName(45034)).toBe('Unknown Error');
  });
});
