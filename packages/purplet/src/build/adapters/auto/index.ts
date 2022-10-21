import { Logger } from 'purplet/internal';
import { gateway } from '../gateway';
import type { Adapter } from '../../adapter';

export function auto() {
  const log = new Logger('adapter-auto');
  let adapter: Adapter;
  if (process.env.CF_PAGES) {
    throw new Error('Cloudflare Pages is not yet supported');
  } else if (process.env.VERCEL) {
    throw new Error('Vercel is not yet supported');
  } else if (process.env.NETLIFY) {
    throw new Error('Netlify is not yet supported');
  }
  adapter = gateway();
  log('auto-detected to use adapter: %s', adapter.name);
  return adapter;
}
