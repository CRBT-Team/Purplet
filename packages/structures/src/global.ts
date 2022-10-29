import type { Rest } from '@purplet/rest';

export let rest: Rest;

export function setStructuresRest(newRest: Rest) {
  rest = newRest;
}
