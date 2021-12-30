import type { Args } from '.';
import { build } from './build';

export async function run(args: Args) {
  const out = await build(args);
  import(`file://${out}`);
}
