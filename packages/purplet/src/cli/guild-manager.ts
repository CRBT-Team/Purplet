import { CLIError } from '../lib/errors';

export interface GuildManagerOptions {
  root: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function guildManager({ root }: GuildManagerOptions) {
  throw new CLIError('Not implemented', 'The Guild Manager CLI has not been implemented yet.');
}
