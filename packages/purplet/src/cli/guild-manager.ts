import { CLIError } from '../lib/errors';

export interface GuildManagerOptions {
  root: string;
}

export async function guildManager({ root }: GuildManagerOptions) {
  throw new CLIError('Not implemented', 'The Guild Manager CLI has not been implemented yet.');
}
