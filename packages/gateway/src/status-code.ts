import type { Dict } from '@paperdave/utils';
import { GatewayCloseCodes } from 'discord-api-types/gateway';

const WebSocketCloseCodes: Dict<string> = {
  '1000': 'Normal Closure',
  '1001': 'Going Away',
  '1002': 'Protocol error',
  '1003': 'Unsupported Data',
  '1004': 'Reserved',
  '1005': 'No Status Rcvd',
  '1006': 'Abnormal Closure',
  '1007': 'Invalid Frame Payload Data',
  '1008': 'Policy Violation',
  '1009': 'Message Too Big',
  '1010': 'Mandatory Ext.',
  '1011': 'Internal Error',
  '1012': 'Service Restart',
  '1013': 'Try Again Later',
  '1014': 'Invalid Gateway',
  '1015': 'TLS Handshake Error',

  // Override
  [GatewayCloseCodes.InvalidAPIVersion]: 'Invalid API Version',
};

export function getWSCodeDisplayName(code: number) {
  return (
    WebSocketCloseCodes[code] ??
    GatewayCloseCodes[code]?.replace(/([a-z])([A-Z])/g, '$1 $2') ??
    'Unknown Error'
  );
}
